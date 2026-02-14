import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma } from './helpers';
import { Express } from 'express';

describe('Subject Management API', () => {
    let app: Express;
    let token: string;
    let createdSubjectId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);
    });

    afterAll(async () => {
        // Cleanup: Delete test subject if created
        if (createdSubjectId) {
            await prisma.subject.delete({ where: { id: createdSubjectId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/subjects', () => {
        it('should get all subjects', async () => {
            const response = await request(app)
                .get('/api/subjects')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            if (response.body.length > 0) {
                expect(response.body[0]).toHaveProperty('code');
                expect(response.body[0]).toHaveProperty('name');
            }
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/subjects');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/subjects', () => {
        it('should create a new subject', async () => {
            const newSubject = {
                code: `TESTSUB${Date.now()}`,
                name: 'Môn Test'
            };

            const response = await request(app)
                .post('/api/subjects')
                .set('Authorization', `Bearer ${token}`)
                .send(newSubject);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('code', newSubject.code);
            expect(response.body).toHaveProperty('name', newSubject.name);

            createdSubjectId = response.body.id;
        });

        it('should reject duplicate subject code', async () => {
            if (createdSubjectId) {
                const existingSubject = await prisma.subject.findUnique({ where: { id: createdSubjectId } });

                const response = await request(app)
                    .post('/api/subjects')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        code: existingSubject?.code,
                        name: 'Another Name'
                    });

                expect(response.status).toBe(409);
            }
        });

        it('should reject subject with missing required fields', async () => {
            const response = await request(app)
                .post('/api/subjects')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Missing Code'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/subjects/:id', () => {
        it('should get subject by ID', async () => {
            if (createdSubjectId) {
                const response = await request(app)
                    .get(`/api/subjects/${createdSubjectId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('id', createdSubjectId);
            }
        });

        it('should return 404 for non-existent subject', async () => {
            const response = await request(app)
                .get('/api/subjects/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /api/subjects/:id', () => {
        it('should update subject details', async () => {
            if (createdSubjectId) {
                const response = await request(app)
                    .put(`/api/subjects/${createdSubjectId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        code: `TESTSUBUP${Date.now()}`,
                        name: 'Môn Test Updated'
                    });

                expect(response.status).toBe(200);
                expect(response.body.name).toBe('Môn Test Updated');
                expect(response.body.code).toContain('TESTSUBUP');
            }
        });

        it('should return 404 for non-existent subject', async () => {
            const response = await request(app)
                .put('/api/subjects/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    code: 'NOVAl',
                    name: 'Non-existent'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/subjects/:id', () => {
        it('should delete subject if not used', async () => {
            if (createdSubjectId) {
                const response = await request(app)
                    .delete(`/api/subjects/${createdSubjectId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);

                const deleted = await prisma.subject.findUnique({
                    where: { id: createdSubjectId }
                });
                expect(deleted).toBeNull();

                createdSubjectId = 0;
            }
        });

        it('should reject deletion if used (has scores/assignments)', async () => {
            // Get a subject that has scores (seeded TOAN/VAN/ANH usually have scores)
            const subjectWithScores = await prisma.subject.findFirst({
                where: {
                    scores: {
                        some: {}
                    }
                }
            });

            if (subjectWithScores) {
                const response = await request(app)
                    .delete(`/api/subjects/${subjectWithScores.id}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
            }
        });

        it('should return 404 for non-existent subject', async () => {
            const response = await request(app)
                .delete('/api/subjects/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
