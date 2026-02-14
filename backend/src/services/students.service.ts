import { Student, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class StudentsService {
    // 1. Get All Students (with Pagination & Search)
    async getAllStudents(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;

        // Build filter condition
        const where: Prisma.StudentWhereInput = {
            isDeleted: false,
            ...(search ? {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { studentCode: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        };

        // Execute queries in parallel
        const [data, total] = await Promise.all([
            prisma.student.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' }
            }),
            prisma.student.count({ where })
        ]);

        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // 2. Get Student by ID
    async getStudentById(id: number): Promise<Student | null> {
        return prisma.student.findFirst({
            where: {
                id,
                isDeleted: false
            },
            include: {
                parent: true // Include parent info if needed
            }
        });
    }

    // 3. Create Student
    async createStudent(data: any): Promise<Student> {
        // Check if studentCode exists
        const existing = await prisma.student.findUnique({
            where: { studentCode: data.studentCode }
        });
        if (existing) {
            throw new ApiError(409, 'Student code already exists');
        }

        return prisma.student.create({
            data: {
                studentCode: data.studentCode,
                fullName: data.fullName,
                dob: new Date(data.dob),
                gender: data.gender,
                parentId: data.parentId || null
            }
        });
    }

    // 4. Update Student
    async updateStudent(id: number, data: any): Promise<Student> {
        return prisma.student.update({
            where: { id },
            data: {
                fullName: data.fullName,
                dob: data.dob ? new Date(data.dob) : undefined,
                gender: data.gender,
                parentId: data.parentId,
                studentCode: data.studentCode
            }
        });
    }

    // 5. Delete Student (Soft Delete)
    async deleteStudent(id: number): Promise<Student> {
        return prisma.student.update({
            where: { id },
            data: { isDeleted: true }
        });
    }
}
