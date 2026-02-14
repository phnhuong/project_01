import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma } from './helpers';
import { Express } from 'express';

describe('Authentication API', () => {
    let app: Express;

    beforeAll(async () => {
        app = createTestApp();
        // Create a temp teacher for testing
        const prisma = await import('../config/prisma').then(m => m.default);
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash('password123', 10);
        await prisma.user.upsert({
            where: { username: 'test_teacher' },
            update: { password: hashedPassword },
            create: {
                username: 'test_teacher',
                password: hashedPassword,
                fullName: 'Test Teacher',
                systemRoles: ['TEACHER'],
                isActive: true
            }
        });
    });

    afterAll(async () => {
        const prisma = await import('../config/prisma').then(m => m.default);
        await prisma.user.delete({ where: { username: 'test_teacher' } }).catch(() => { });
        await disconnectPrisma();
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with valid admin credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'admin123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
            expect(response.body.token.length).toBeGreaterThan(0);
        });

        it('should login successfully with valid teacher credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'test_teacher',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should reject login with invalid username', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'nonexistent',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should reject login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });

        it('should reject login with missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({});

            expect(response.status).toBe(400);
        });

        it('should reject login with missing password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'admin'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return current user info with valid token', async () => {
            const token = await loginAsAdmin(app);

            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('username', 'admin');
            expect(response.body.user).toHaveProperty('fullName');
            expect(response.body.user).toHaveProperty('systemRoles');
            expect(response.body.user.password).toBeUndefined(); // Password should not be returned
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/auth/me');

            expect(response.status).toBe(401);
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid_token');

            expect(response.status).toBe(401);
        });

        it('should reject request with malformed Authorization header', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'InvalidFormat');

            expect(response.status).toBe(401);
        });
    });
});
