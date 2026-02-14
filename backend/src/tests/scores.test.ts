import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma } from './helpers';
import { Express } from 'express';

describe('Score Management API', () => {
    let app: Express;
    let token: string;
    let createdScoreId: number;
    let classId: number;
    let studentId: number;
    let subjectId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);

        // 1. Get/Create Dependencies (Grade, Year, Teacher) - similar to Class tests
        let grade = await prisma.grade.findFirst();
        if (!grade) {
            grade = await prisma.grade.create({ data: { name: 'Khối 10 Test Scores', level: 10 } });
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
                    username: `test_teacher_score_${Date.now()}`,
                    password: hashedPassword,
                    fullName: 'Test Teacher Score',
                    systemRoles: ['TEACHER'],
                    isActive: true
                }
            });
        }

        // 2. Create Class
        const cls = await prisma.class.create({
            data: {
                name: `ScoreTestClass${Date.now()}`,
                gradeId: grade.id,
                academicYearId: year.id,
                homeroomTeacherId: teacher.id
            }
        });
        classId = cls.id;

        // 3. Create Student
        let parent = await prisma.parent.findFirst();
        if (!parent) {
            parent = await prisma.parent.create({
                data: { fullName: 'Test Parent Score', phone: `09${Date.now()}` }
            });
        }
        const student = await prisma.student.create({
            data: {
                studentCode: `STSCORE${Date.now()}`,
                fullName: 'Test Student For Score',
                dob: new Date('2010-01-01'),
                gender: 'Nam',
                parentId: parent.id
            }
        });
        studentId = student.id;

        // 4. Enroll Student
        await prisma.classEnrollment.create({
            data: {
                classId: classId,
                studentId: studentId
            }
        });

        // 5. Create Subject
        const subject = await prisma.subject.create({
            data: {
                code: `SUB${Date.now()}`,
                name: 'Test Subject'
            }
        });
        subjectId = subject.id;
    });

    afterAll(async () => {
        // Cleanup: Score -> Enrollment -> Student -> Class -> Subject
        if (createdScoreId) {
            await prisma.score.delete({ where: { id: createdScoreId } }).catch(() => { });
        }
        if (studentId && classId) {
            await prisma.classEnrollment.deleteMany({ where: { studentId, classId } }).catch(() => { });
        }
        if (studentId) {
            await prisma.student.delete({ where: { id: studentId } }).catch(() => { });
        }
        if (classId) {
            await prisma.class.delete({ where: { id: classId } }).catch(() => { });
        }
        if (subjectId) {
            await prisma.subject.delete({ where: { id: subjectId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/scores', () => {
        it('should get all scores', async () => {
            const response = await request(app)
                .get('/api/scores')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/scores');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/scores', () => {
        it('should create a new score', async () => {
            const newScore = {
                studentId,
                subjectId,
                classId,
                scoreType: 'MIDTERM',
                value: 8.5,
                semester: 1 // Optional depending on controller, but usually good to have
            };

            const response = await request(app)
                .post('/api/scores')
                .set('Authorization', `Bearer ${token}`)
                .send(newScore);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(Number(response.body.value)).toBe(8.5);
            expect(response.body).toHaveProperty('type', 'MIDTERM');

            createdScoreId = response.body.id;
        });

        it('should reject score with invalid range', async () => {
            const response = await request(app)
                .post('/api/scores')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    studentId,
                    subjectId,
                    classId,
                    scoreType: 'FINAL',
                    value: 11 // > 10
                });

            expect(response.status).toBe(400);
        });

        it('should reject score for non-enrolled student', async () => {
            // Create another student but DON'T enroll
            const unenrolledStudent = await prisma.student.create({
                data: {
                    studentCode: `STUN${Date.now()}`,
                    fullName: 'Unenrolled Student',
                    dob: new Date('2010-01-01'),
                    gender: 'Nữ',
                    parentId: (await prisma.parent.findFirst())?.id
                }
            });

            const response = await request(app)
                .post('/api/scores')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    studentId: unenrolledStudent.id,
                    subjectId,
                    classId,
                    scoreType: 'REGULAR',
                    value: 9
                });

            expect(response.status).toBe(400); // Should fail validation

            // Cleanup
            await prisma.student.delete({ where: { id: unenrolledStudent.id } });
        });
    });

    describe('GET /api/scores/:id', () => {
        it('should get score by ID', async () => {
            if (createdScoreId) {
                const response = await request(app)
                    .get(`/api/scores/${createdScoreId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('id', createdScoreId);
            }
        });

        it('should return 404 for non-existent score', async () => {
            const response = await request(app)
                .get('/api/scores/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/scores/:id', () => {
        it('should update score details', async () => {
            if (createdScoreId) {
                const response = await request(app)
                    .put(`/api/scores/${createdScoreId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        value: 9.5
                    });

                expect(response.status).toBe(200);
                expect(Number(response.body.value)).toBe(9.5);
            }
        });

        it('should reject invalid range update', async () => {
            if (createdScoreId) {
                const response = await request(app)
                    .put(`/api/scores/${createdScoreId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        value: -1
                    });

                expect(response.status).toBe(400);
            }
        });
    });

    describe('DELETE /api/scores/:id', () => {
        it('should delete score', async () => {
            if (createdScoreId) {
                const response = await request(app)
                    .delete(`/api/scores/${createdScoreId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                createdScoreId = 0;
            }
        });

        it('should return 404 for non-existent score', async () => {
            const response = await request(app)
                .delete('/api/scores/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
