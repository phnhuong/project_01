import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma } from './helpers';
import { Express } from 'express';

describe('User Management API', () => {
    let app: Express;
    let token: string;
    let createdUserId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);
    });

    afterAll(async () => {
        // Cleanup: Delete test user if created
        if (createdUserId) {
            await prisma.user.delete({ where: { id: createdUserId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/users', () => {
        it('should get all users with pagination', async () => {
            const response = await request(app)
                .get('/api/users?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
            expect(response.body).toHaveProperty('pagination');

            // Verify no passwords are returned
            response.body.data.forEach((user: any) => {
                expect(user.password).toBeUndefined();
            });
        });

        it('should search users by username or fullName', async () => {
            const response = await request(app)
                .get('/api/users?search=admin')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBeGreaterThan(0);
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/users');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should get user by ID', async () => {
            const allUsers = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);

            const userId = allUsers.body.data[0].id;

            const response = await request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', userId);
            expect(response.body).toHaveProperty('username');
            expect(response.body.password).toBeUndefined();
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .get('/api/users/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = {
                username: `testuser_${Date.now()}`,
                password: 'password123',
                fullName: 'Test User',
                systemRoles: ['TEACHER']
            };

            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('username', newUser.username);
            expect(response.body).toHaveProperty('fullName', newUser.fullName);
            expect(response.body.password).toBeUndefined();

            createdUserId = response.body.id;
        });

        it('should reject duplicate username', async () => {
            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'admin',
                    password: 'password123',
                    fullName: 'Duplicate Admin',
                    systemRoles: ['ADMIN']
                });

            expect(response.status).toBe(409);
        });

        it('should reject user creation with missing required fields', async () => {
            const response = await request(app)
                .post('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    username: 'incomplete'
                    // Missing password, fullName, systemRoles
                });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update user details', async () => {
            const allUsers = await request(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`);

            const userId = allUsers.body.data[0].id;

            const response = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Updated Name'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('fullName', 'Updated Name');
        });

        it('should update user password', async () => {
            if (createdUserId) {
                const response = await request(app)
                    .put(`/api/users/${createdUserId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        password: 'newpassword123'
                    });

                expect(response.status).toBe(200);
            }
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .put('/api/users/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    fullName: 'Non-existent'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should soft delete user (set isActive to false)', async () => {
            if (createdUserId) {
                const response = await request(app)
                    .delete(`/api/users/${createdUserId}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(200);

                // Verify user is marked as inactive
                const user = await prisma.user.findUnique({
                    where: { id: createdUserId }
                });
                expect(user?.isActive).toBe(false);
            }
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app)
                .delete('/api/users/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
