import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from '../routes/auth.routes';
import usersRoutes from '../routes/users.routes';
import studentsRoutes from '../routes/students.routes';
import parentsRoutes from '../routes/parents.routes';
import academicYearsRoutes from '../routes/academic-years.routes';
import gradesRoutes from '../routes/grades.routes';
import subjectsRoutes from '../routes/subjects.routes';
import classesRoutes from '../routes/classes.routes';
import scoresRoutes from '../routes/scores.routes';

dotenv.config();

// Database setup
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

/**
 * Create Express app instance for testing
 */
export function createTestApp(): Express {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Mount routes
    app.use('/api/auth', authRoutes as any);
    app.use('/api/users', usersRoutes);
    app.use('/api/students', studentsRoutes);
    app.use('/api/parents', parentsRoutes);
    app.use('/api/academic-years', academicYearsRoutes);
    app.use('/api/grades', gradesRoutes);
    app.use('/api/subjects', subjectsRoutes);
    app.use('/api/classes', classesRoutes);
    app.use('/api/scores', scoresRoutes);

    app.get('/', (req, res) => {
        res.send('Student Management API is running!');
    });

    return app;
}

/**
 * Login helper - returns authentication token
 */
export async function loginAsAdmin(app: Express): Promise<string> {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            username: 'admin',
            password: 'admin123'
        });

    if (response.status !== 200 || !response.body.token) {
        throw new Error('Failed to login as admin');
    }

    return response.body.token;
}

/**
 * Login as teacher - returns authentication token
 */
export async function loginAsTeacher(app: Express, teacherNumber: number = 1): Promise<string> {
    const response = await request(app)
        .post('/api/auth/login')
        .send({
            username: `teacher${teacherNumber}`,
            password: 'password123'
        });

    if (response.status !== 200 || !response.body.token) {
        throw new Error(`Failed to login as teacher${teacherNumber}`);
    }

    return response.body.token;
}

/**
 * Get a seeded academic year ID
 */
export async function getFirstAcademicYearId(): Promise<number> {
    const academicYear = await prisma.academicYear.findFirst({
        orderBy: { id: 'asc' }
    });

    if (!academicYear) {
        throw new Error('No academic year found in database. Please run seed first.');
    }

    return academicYear.id;
}

/**
 * Get a seeded grade ID
 */
export async function getFirstGradeId(): Promise<number> {
    const grade = await prisma.grade.findFirst({
        orderBy: { id: 'asc' }
    });

    if (!grade) {
        throw new Error('No grade found in database. Please run seed first.');
    }

    return grade.id;
}

/**
 * Get a seeded subject ID
 */
export async function getFirstSubjectId(): Promise<number> {
    const subject = await prisma.subject.findFirst({
        orderBy: { id: 'asc' }
    });

    if (!subject) {
        throw new Error('No subject found in database. Please run seed first.');
    }

    return subject.id;
}

/**
 * Get a seeded student ID
 */
export async function getFirstStudentId(): Promise<number> {
    const student = await prisma.student.findFirst({
        where: { isDeleted: false },
        orderBy: { id: 'asc' }
    });

    if (!student) {
        throw new Error('No student found in database. Please run seed first.');
    }

    return student.id;
}

/**
 * Get a seeded parent ID
 */
export async function getFirstParentId(): Promise<number> {
    const parent = await prisma.parent.findFirst({
        orderBy: { id: 'asc' }
    });

    if (!parent) {
        throw new Error('No parent found in database. Please run seed first.');
    }

    return parent.id;
}

/**
 * Get a seeded class ID
 */
export async function getFirstClassId(): Promise<number> {
    const classRecord = await prisma.class.findFirst({
        orderBy: { id: 'asc' }
    });

    if (!classRecord) {
        throw new Error('No class found in database. Please run seed first.');
    }

    return classRecord.id;
}

/**
 * Get first teacher user ID
 */
export async function getFirstTeacherId(): Promise<number> {
    const teacher = await prisma.user.findFirst({
        where: {
            systemRoles: {
                has: 'TEACHER'
            }
        },
        orderBy: { id: 'asc' }
    });

    if (!teacher) {
        throw new Error('No teacher found in database. Please run seed first.');
    }

    return teacher.id;
}

/**
 * Clean up test data (optional - use carefully)
 * This deletes all data created after the seed data
 */
export async function cleanupTestData(createdIds: {
    users?: number[];
    students?: number[];
    parents?: number[];
    classes?: number[];
    scores?: number[];
    subjects?: number[];
    grades?: number[];
    academicYears?: number[];
}) {
    // Delete in reverse order of dependencies
    if (createdIds.scores?.length) {
        await prisma.score.deleteMany({
            where: { id: { in: createdIds.scores } }
        });
    }

    if (createdIds.classes?.length) {
        await prisma.classEnrollment.deleteMany({
            where: { classId: { in: createdIds.classes } }
        });
        await prisma.class.deleteMany({
            where: { id: { in: createdIds.classes } }
        });
    }

    if (createdIds.students?.length) {
        await prisma.student.deleteMany({
            where: { id: { in: createdIds.students } }
        });
    }

    if (createdIds.parents?.length) {
        await prisma.parent.deleteMany({
            where: { id: { in: createdIds.parents } }
        });
    }

    if (createdIds.users?.length) {
        await prisma.user.deleteMany({
            where: { id: { in: createdIds.users } }
        });
    }

    if (createdIds.academicYears?.length) {
        await prisma.academicYear.deleteMany({
            where: { id: { in: createdIds.academicYears } }
        });
    }

    if (createdIds.subjects?.length) {
        await prisma.subject.deleteMany({
            where: { id: { in: createdIds.subjects } }
        });
    }

    if (createdIds.grades?.length) {
        await prisma.grade.deleteMany({
            where: { id: { in: createdIds.grades } }
        });
    }
}

/**
 * Disconnect Prisma client (call in afterAll)
 */
export async function disconnectPrisma() {
    await prisma.$disconnect();
    await pool.end();
}
