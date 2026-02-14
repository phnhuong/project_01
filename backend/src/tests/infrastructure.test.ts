import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma } from './helpers';
import { Express } from 'express';

describe('Test Infrastructure Verification', () => {
    let app: Express;

    beforeAll(() => {
        app = createTestApp();
    });

    afterAll(async () => {
        await disconnectPrisma();
    });

    describe('App Setup', () => {
        it('should create a working Express app', async () => {
            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Student Management API is running!');
        });
    });

    describe('Authentication Helpers', () => {
        it('should login as admin and return a token', async () => {
            const token = await loginAsAdmin(app);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.length).toBeGreaterThan(0);
        });

        it('should use token to access protected route', async () => {
            const token = await loginAsAdmin(app);
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.user).toBeDefined();
            expect(response.body.user.username).toBe('admin');
        });
    });
});
