import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma } from './helpers';
import { Express } from 'express';

describe('Grade Management API', () => {
    let app: Express;
    let token: string;
    let createdGradeId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);
    });

    afterAll(async () => {
        // Cleanup: Delete test grade if created
        if (createdGradeId) {
            await prisma.grade.delete({ where: { id: createdGradeId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/grades', () => {
        it('should get all grades', async () => {
            const response = await request(app)
                .get('/api/grades')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            // Seed data should be there
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('name');
                expect(response.body[0]).toHaveProperty('level');
            }
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/grades');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/grades', () => {
        it('should create a new grade', async () => {
            const newGrade = {
                name: `Khối Test ${Date.now()}`,
                level: 13 // Virtual level for test
            };

            const response = await request(app)
                .post('/api/grades')
                .set('Authorization', `Bearer ${token}`)
                .send(newGrade);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', newGrade.name);
            expect(response.body).toHaveProperty('level', newGrade.level);

            createdGradeId = response.body.id;
        });

        it('should reject duplicate grade name', async () => {
            if (createdGradeId) {
                const existingGrade = await prisma.grade.findUnique({ where: { id: createdGradeId } });

                const response = await request(app)
                    .post('/api/grades')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        name: existingGrade?.name,
                        level: 13
                    });

                expect(response.status).toBe(409);
            }
        });

        it('should reject grade with missing required fields', async () => {
            const response = await request(app)
                .post('/api/grades')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    level: 10
                    // Missing name
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/grades/:id', () => {
        it('should get grade by ID', async () => {
            if (createdGradeId) {
                const response = await request(app)
                    .get(`/api/grades/${createdGradeId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('id', createdGradeId);
            }
        });

        it('should return 404 for non-existent grade', async () => {
            const response = await request(app)
                .get('/api/grades/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/grades/:id', () => {
        it('should update grade details', async () => {
            if (createdGradeId) {
                const response = await request(app)
                    .put(`/api/grades/${createdGradeId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        name: `Khối Test Updated ${Date.now()}`,
                        level: 14
                    });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('level', 14);
                expect(response.body.name).toContain('Updated');
            }
        });

        it('should return 404 for non-existent grade', async () => {
            const response = await request(app)
                .put('/api/grades/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Non-existent'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/grades/:id', () => {
        it('should delete grade if no classes exist', async () => {
            if (createdGradeId) {
                const response = await request(app)
                    .delete(`/api/grades/${createdGradeId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);

                // Verify deletion
                const deleted = await prisma.grade.findUnique({
                    where: { id: createdGradeId }
                });
                expect(deleted).toBeNull();

                // Reset createdGradeId to avoid cleanup error
                createdGradeId = 0;
            }
        });

        it('should reject deletion if classes exist', async () => {
            // Get a grade that has classes (from Seed)
            // Seed creates 'Khối 10', 'Khối 11', 'Khối 12' and classes for them.
            const gradeWithClasses = await prisma.grade.findFirst({
                where: {
                    classes: {
                        some: {}
                    }
                }
            });

            if (gradeWithClasses) {
                const response = await request(app)
                    .delete(`/api/grades/${gradeWithClasses.id}`)
                    .set('Authorization', `Bearer ${token}`);

                // API Guide says check for 400.
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
            }
        });

        it('should return 404 for non-existent grade', async () => {
            const response = await request(app)
                .delete('/api/grades/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
