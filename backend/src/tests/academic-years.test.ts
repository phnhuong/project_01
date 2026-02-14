import request from 'supertest';
import { createTestApp, loginAsAdmin, disconnectPrisma, prisma } from './helpers';
import { Express } from 'express';

describe('Academic Year Management API', () => {
    let app: Express;
    let token: string;
    let createdAcademicYearId: number;

    beforeAll(async () => {
        app = createTestApp();
        token = await loginAsAdmin(app);

        // Ensure an active academic year exists
        const activeYear = await prisma.academicYear.findFirst({ where: { isCurrent: true } });
        if (!activeYear) {
            await prisma.academicYear.create({
                data: {
                    name: `Active Year ${Date.now()}`,
                    startDate: new Date('2024-09-01'),
                    endDate: new Date('2025-06-30'),
                    isCurrent: true
                }
            });
        }
    });

    afterAll(async () => {
        // Cleanup: Delete test academic year if created
        if (createdAcademicYearId) {
            await prisma.academicYear.delete({ where: { id: createdAcademicYearId } }).catch(() => { });
        }
        await disconnectPrisma();
    });

    describe('GET /api/academic-years', () => {
        it('should get all academic years sorted by startDate desc', async () => {
            const response = await request(app)
                .get('/api/academic-years')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('startDate');
            expect(response.body[0]).toHaveProperty('endDate');
            expect(response.body[0]).toHaveProperty('isCurrent');
        });

        it('should reject request without authentication', async () => {
            const response = await request(app)
                .get('/api/academic-years');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/academic-years/active', () => {
        it('should get the current active academic year', async () => {
            const response = await request(app)
                .get('/api/academic-years/active')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('isCurrent', true);
            expect(response.body).toHaveProperty('name');
        });
    });

    describe('GET /api/academic-years/:id', () => {
        it('should get academic year by ID', async () => {
            const allYears = await request(app)
                .get('/api/academic-years')
                .set('Authorization', `Bearer ${token}`);

            const yearId = allYears.body[0].id;

            const response = await request(app)
                .get(`/api/academic-years/${yearId}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', yearId);
            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('startDate');
            expect(response.body).toHaveProperty('endDate');
        });

        it('should return 404 for non-existent academic year', async () => {
            const response = await request(app)
                .get('/api/academic-years/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/academic-years', () => {
        it('should create a new academic year', async () => {
            const newYear = {
                name: `Năm học ${Date.now()}`,
                startDate: '2026-09-01',
                endDate: '2027-06-30',
                isCurrent: false
            };

            const response = await request(app)
                .post('/api/academic-years')
                .set('Authorization', `Bearer ${token}`)
                .send(newYear);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', newYear.name);
            expect(response.body).toHaveProperty('isCurrent', false);

            createdAcademicYearId = response.body.id;
        });

        it('should auto-deactivate other years when creating one with isCurrent: true', async () => {
            const newYear = {
                name: `Năm học hiện tại ${Date.now()}`,
                startDate: '2027-09-01',
                endDate: '2028-06-30',
                isCurrent: true
            };

            const response = await request(app)
                .post('/api/academic-years')
                .set('Authorization', `Bearer ${token}`)
                .send(newYear);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('isCurrent', true);

            // Verify only one current year exists
            const allYears = await prisma.academicYear.findMany({
                where: { isCurrent: true }
            });
            expect(allYears.length).toBe(1);
            expect(allYears[0].id).toBe(response.body.id);

            // Cleanup
            await prisma.academicYear.delete({ where: { id: response.body.id } }).catch(() => { });
        });

        it('should reject duplicate academic year name', async () => {
            const allYears = await request(app)
                .get('/api/academic-years')
                .set('Authorization', `Bearer ${token}`);

            const existingName = allYears.body[0].name;

            const response = await request(app)
                .post('/api/academic-years')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: existingName,
                    startDate: '2026-09-01',
                    endDate: '2027-06-30',
                    isCurrent: false
                });

            expect(response.status).toBe(409);
        });

        it('should reject academic year with missing required fields', async () => {
            const response = await request(app)
                .post('/api/academic-years')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Incomplete Year'
                    // Missing startDate, endDate
                });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/academic-years/:id', () => {
        it('should update academic year details', async () => {
            if (createdAcademicYearId) {
                const response = await request(app)
                    .put(`/api/academic-years/${createdAcademicYearId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        name: 'Updated Academic Year Name'
                    });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('name', 'Updated Academic Year Name');
            }
        });

        it('should auto-deactivate other years when updating one to isCurrent: true', async () => {
            if (createdAcademicYearId) {
                const response = await request(app)
                    .put(`/api/academic-years/${createdAcademicYearId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        isCurrent: true
                    });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('isCurrent', true);

                // Verify only one current year exists
                const allYears = await prisma.academicYear.findMany({
                    where: { isCurrent: true }
                });
                expect(allYears.length).toBe(1);
            }
        });

        it('should return 404 for non-existent academic year', async () => {
            const response = await request(app)
                .put('/api/academic-years/99999')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Non-existent'
                });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/academic-years/:id', () => {
        it('should delete academic year if no classes exist', async () => {
            // Create a year with no classes
            const yearWithNoClasses = await prisma.academicYear.create({
                data: {
                    name: `Năm học xóa ${Date.now()}`,
                    startDate: new Date('2030-09-01'),
                    endDate: new Date('2031-06-30'),
                    isCurrent: false
                }
            });

            const response = await request(app)
                .delete(`/api/academic-years/${yearWithNoClasses.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);

            // Verify deletion
            const deleted = await prisma.academicYear.findUnique({
                where: { id: yearWithNoClasses.id }
            });
            expect(deleted).toBeNull();
        });

        it('should reject deletion if classes exist', async () => {
            // Get an academic year that has classes
            const yearWithClasses = await prisma.academicYear.findFirst({
                where: {
                    classes: {
                        some: {}
                    }
                }
            });

            if (yearWithClasses) {
                const response = await request(app)
                    .delete(`/api/academic-years/${yearWithClasses.id}`)
                    .set('Authorization', `Bearer ${token}`);

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('message');
            }
        });

        it('should return 404 for non-existent academic year', async () => {
            const response = await request(app)
                .delete('/api/academic-years/99999')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });
    });
});
