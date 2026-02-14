import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma, getFirstParentId } from './helpers';
import { Express } from 'express';

describe('Student Management API', () => {
    let app: Express;
    let token: string;
    let createdStudentId: number;
    let parentId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);
        parentId = await getFirstParentId();
    });

    afterAll(async () => {
        // Cleanup: Delete test student if created
        if (createdStudentId) {
            await prisma.student.delete({ where: { id: createdStudentId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/students', () => {
        it('should get all students with pagination', async () => {
            const response = await request(app)
                .get('/api/students?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body).toHaveProperty('pagination');
        });

        it('should search students by name', async () => {
            const response = await request(app)
                .get('/api/students?search=HS')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/students');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/students/:id', () => {
        it('should get student by ID with parent info', async () => {
            const allStudents = await request(app)
                .get('/api/students')
                .set('Authorization', `Bearer ${token}`);

            const studentId = allStudents.body.data[0].id;

            const response = await request(app)
                .get(`/api/students/${studentId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', studentId);
            expect(response.body).toHaveProperty('studentCode');
            expect(response.body).toHaveProperty('fullName');
            expect(response.body).toHaveProperty('dob');
            expect(response.body).toHaveProperty('gender');
        });

        it('should return 404 for non-existent student', async () => {
            const response = await request(app)
                .get('/api/students/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/students', () => {
        it('should create a new student', async () => {
            const newStudent = {
                studentCode: `HS${Date.now()}`,
                fullName: 'Test Student',
                dob: '2008-01-01',
                gender: 'Nam',
                parentId: parentId
            };

            const response = await request(app)
                .post('/api/students')
                .set('Authorization', `Bearer ${token}`)
                .send(newStudent);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('studentCode', newStudent.studentCode);
            expect(response.body).toHaveProperty('fullName', newStudent.fullName);
            expect(response.body).toHaveProperty('gender', newStudent.gender);

            createdStudentId = response.body.id;
        });

        it('should reject duplicate student code', async () => {
            const allStudents = await request(app)
                .get('/api/students')
                .set('Authorization', `Bearer ${token}`);

            const existingCode = allStudents.body.data[0].studentCode;

            const response = await request(app)
                .post('/api/students')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    studentCode: existingCode,
                    fullName: 'Duplicate Code Student',
                    dob: '2008-01-01',
                    gender: 'Nam',
                    parentId: parentId
                });

            expect(response.status).toBe(409);
        });

        it('should reject student creation with missing required fields', async () => {
            const response = await request(app)
                .post('/api/students')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    studentCode: 'HS999'
                    // Missing fullName, dob, gender
                });

            expect(response.status).toBe(400);
        });

        it('should create student without parent', async () => {
            const newStudent = {
                studentCode: `HS_NOPARENT_${Date.now()}`,
                fullName: 'Student Without Parent',
                dob: '2008-01-01',
                gender: 'Nữ'
            };

            const response = await request(app)
                .post('/api/students')
                .set('Authorization', `Bearer ${token}`)
                .send(newStudent);

            expect(response.status).toBe(201);
            expect(response.body.parentId).toBeNull();

            // Cleanup
            await prisma.student.delete({ where: { id: response.body.id } }).catch(() => { });
        });
    });

    describe('PUT /api/students/:id', () => {
        it('should update student details', async () => {
            const allStudents = await request(app)
                .get('/api/students')
                .set('Authorization', `Bearer ${token}`);

            const studentId = allStudents.body.data[0].id;

            const response = await request(app)
                .put(`/api/students/${studentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Updated Student Name',
                    dob: '2008-01-01',
                    gender: 'Nam'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('fullName', 'Updated Student Name');
        });

        it('should return 404 for non-existent student', async () => {
            const response = await request(app)
                .put('/api/students/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Non-existent'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/students/:id', () => {
        it('should soft delete student (set isDeleted to true)', async () => {
            if (createdStudentId) {
                const response = await request(app)
                    .delete(`/api/students/${createdStudentId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);

                // Verify student is marked as deleted
                const student = await prisma.student.findUnique({
                    where: { id: createdStudentId }
                });
                expect(student?.isDeleted).toBe(true);
            }
        });

        it('should return 404 for non-existent student', async () => {
            const response = await request(app)
                .delete('/api/students/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
