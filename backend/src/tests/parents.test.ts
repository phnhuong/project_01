import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma } from './helpers';
import { Express } from 'express';

describe('Parent Management API', () => {
    let app: Express;
    let token: string;
    let createdParentId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);
    });

    afterAll(async () => {
        // Cleanup: Delete test parent if created
        if (createdParentId) {
            await prisma.parent.delete({ where: { id: createdParentId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/parents', () => {
        it('should get all parents with pagination', async () => {
            const response = await request(app)
                .get('/api/parents?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body).toHaveProperty('pagination');
        });

        it('should search parents by phone number', async () => {
            const response = await request(app)
                .get('/api/parents?search=09')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            // Should find parents with phone numbers containing 0123
        });

        it('should return parents with their students/children', async () => {
            const response = await request(app)
                .get('/api/parents')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data[0]).toHaveProperty('students');
            expect(Array.isArray(response.body.data[0].students)).toBe(true);
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/parents');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/parents/:id', () => {
        it('should get parent by ID with children list', async () => {
            const allParents = await request(app)
                .get('/api/parents')
                .set('Authorization', `Bearer ${token}`);

            const parentId = allParents.body.data[0].id;

            const response = await request(app)
                .get(`/api/parents/${parentId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', parentId);
            expect(response.body).toHaveProperty('fullName');
            expect(response.body).toHaveProperty('phone');
            expect(response.body).toHaveProperty('students');
            expect(Array.isArray(response.body.students)).toBe(true);
        });

        it('should return 404 for non-existent parent', async () => {
            const response = await request(app)
                .get('/api/parents/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/parents', () => {
        it('should create a new parent', async () => {
            const newParent = {
                fullName: 'Test Parent',
                phone: `09${Date.now().toString().slice(-8)}`
            };

            const response = await request(app)
                .post('/api/parents')
                .set('Authorization', `Bearer ${token}`)
                .send(newParent);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('fullName', newParent.fullName);
            expect(response.body).toHaveProperty('phone', newParent.phone);

            createdParentId = response.body.id;
        });

        it('should reject duplicate phone number', async () => {
            const allParents = await request(app)
                .get('/api/parents')
                .set('Authorization', `Bearer ${token}`);

            const existingPhone = allParents.body.data[0].phone;

            const response = await request(app)
                .post('/api/parents')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Duplicate Phone Parent',
                    phone: existingPhone
                });

            expect(response.status).toBe(409);
        });

        it('should reject parent creation with missing required fields', async () => {
            const response = await request(app)
                .post('/api/parents')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Incomplete Parent'
                    // Missing phone
                });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/parents/:id', () => {
        it('should update parent details', async () => {
            const allParents = await request(app)
                .get('/api/parents')
                .set('Authorization', `Bearer ${token}`);

            const parentId = allParents.body.data[0].id;

            const response = await request(app)
                .put(`/api/parents/${parentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Updated Parent Name',
                    phone: `098${Date.now().toString().slice(-7)}`
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('fullName', 'Updated Parent Name');
        });

        it('should return 404 for non-existent parent', async () => {
            const response = await request(app)
                .put('/api/parents/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Non-existent'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/parents/:id', () => {
        it('should delete parent and set children parentId to null', async () => {
            if (createdParentId) {
                const response = await request(app)
                    .delete(`/api/parents/${createdParentId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);

                // Verify parent is deleted
                const parent = await prisma.parent.findUnique({
                    where: { id: createdParentId }
                });
                expect(parent).toBeNull();
            }
        });

        it('should handle deletion of parent with children gracefully', async () => {
            // Create parent with student
            const parent = await prisma.parent.create({
                data: {
                    fullName: 'Parent To Delete',
                    phone: `091${Date.now().toString().slice(-7)}`
                }
            });

            const student = await prisma.student.create({
                data: {
                    studentCode: `HSDEL${Date.now()}`,
                    fullName: 'Child Student',
                    dob: new Date('2008-01-01'),
                    gender: 'Nam',
                    parentId: parent.id
                }
            });

            const response = await request(app)
                .delete(`/api/parents/${parent.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            // Verify student's parentId is set to null
            const updatedStudent = await prisma.student.findUnique({
                where: { id: student.id }
            });
            expect(updatedStudent?.parentId).toBeNull();

            // Cleanup
            await prisma.student.delete({ where: { id: student.id } }).catch(() => { });
        });

        it('should return 404 for non-existent parent', async () => {
            const response = await request(app)
                .delete('/api/parents/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
