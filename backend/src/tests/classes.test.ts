import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma } from './helpers';
import { Express } from 'express';

describe('Class Management API', () => {
    let app: Express;
    let token: string;
    let createdClassId: number;
    let gradeId: number;
    let academicYearId: number;
    let teacherId: number;
    let studentId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);

        // Get or create necessary foreign keys
        let grade = await prisma.grade.findFirst();
        if (!grade) {
            grade = await prisma.grade.create({ data: { name: 'Khối 10 Test', level: 10 } });
        }

        let year = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
        if (!year) {
            year = await prisma.academicYear.create({
                data: {
                    name: `Active Year ${Date.now()}`,
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    isCurrent: true
                }
            });
        }

        let teacher = await prisma.user.findFirst({ where: { systemRoles: { has: 'TEACHER' } } });
        if (!teacher) {
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.hash('password123', 10);
            teacher = await prisma.user.create({
                data: {
                    username: `test_teacher_${Date.now()}`,
                    password: hashedPassword,
                    fullName: 'Test Teacher',
                    systemRoles: ['TEACHER'],
                    isActive: true
                }
            });
        }

        // Create a test student for enrollment
        let parent = await prisma.parent.findFirst();
        if (!parent) {
            parent = await prisma.parent.create({
                data: { fullName: 'Test Parent', phone: `09${Date.now()}` }
            });
        }

        const student = await prisma.student.create({
            data: {
                studentCode: `TESTST${Date.now()}`,
                fullName: 'Test Student For Class',
                dob: new Date('2010-01-01'),
                gender: 'Nam',
                parentId: parent.id
            }
        });

        gradeId = grade.id;
        academicYearId = year.id;
        teacherId = teacher.id;
        studentId = student.id;
    });

    afterAll(async () => {
        // Cleanup
        if (createdClassId) {
            await prisma.class.delete({ where: { id: createdClassId } }).catch(() => { });
        }
        if (studentId) {
            await prisma.classEnrollment.deleteMany({ where: { studentId } }).catch(() => { });
            await prisma.student.delete({ where: { id: studentId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/classes', () => {
        it('should get all classes', async () => {
            const response = await request(app)
                .get('/api/classes')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/classes');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/classes', () => {
        it('should create a new class', async () => {
            const newClass = {
                name: `10Test${Date.now()}`,
                gradeId,
                academicYearId,
                homeroomTeacherId: teacherId
            };

            const response = await request(app)
                .post('/api/classes')
                .set('Authorization', `Bearer ${token}`)
                .send(newClass);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', newClass.name);

            createdClassId = response.body.id;
        });

        it('should reject class with invalid gradeId', async () => {
            const response = await request(app)
                .post('/api/classes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Invalid Grade Class',
                    gradeId: 999999,
                    academicYearId,
                    homeroomTeacherId: teacherId
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/classes/:id', () => {
        it('should get class by ID', async () => {
            if (createdClassId) {
                const response = await request(app)
                    .get(`/api/classes/${createdClassId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('id', createdClassId);
            }
        });

        it('should return 404 for non-existent class', async () => {
            const response = await request(app)
                .get('/api/classes/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/classes/:id', () => {
        it('should update class details', async () => {
            if (createdClassId) {
                const response = await request(app)
                    .put(`/api/classes/${createdClassId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        name: `10TestUpdated${Date.now()}`,
                        gradeId,
                        academicYearId
                    });

                expect(response.status).toBe(200);
                expect(response.body.name).toContain('Updated');
            }
        });
    });

    describe('POST /api/classes/:id/students', () => {
        it('should enroll a student in the class', async () => {
            if (createdClassId && studentId) {
                const response = await request(app)
                    .post(`/api/classes/${createdClassId}/students`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ studentId });

                expect(response.status).toBe(201);

                // Verify enrollment
                const enrollment = await prisma.classEnrollment.findUnique({
                    where: {
                        studentId_classId: {
                            studentId,
                            classId: createdClassId
                        }
                    }
                });
                expect(enrollment).not.toBeNull();
            }
        });

        it('should reject enrollment if student already enrolled', async () => {
            if (createdClassId && studentId) {
                const response = await request(app)
                    .post(`/api/classes/${createdClassId}/students`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({ studentId });

                expect(response.status).toBe(409);
            }
        });
    });

    describe('DELETE /api/classes/:id/students/:studentId', () => {
        it('should remove student from class', async () => {
            if (createdClassId && studentId) {
                const response = await request(app)
                    .delete(`/api/classes/${createdClassId}/students/${studentId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);

                // Verify removal
                const enrollment = await prisma.classEnrollment.findUnique({
                    where: {
                        studentId_classId: {
                            studentId,
                            classId: createdClassId
                        }
                    }
                });
                expect(enrollment).toBeNull();
            }
        });
    });

    describe('DELETE /api/classes/:id', () => {
        it('should delete class if no enrollments', async () => {
            if (createdClassId) {
                const response = await request(app)
                    .delete(`/api/classes/${createdClassId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                createdClassId = 0;
            }
        });

        it('should return 404 for non-existent class', async () => {
            const response = await request(app)
                .delete('/api/classes/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
