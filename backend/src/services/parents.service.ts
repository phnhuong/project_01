import { Parent, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import bcrypt from 'bcryptjs';

export class ParentsService {
    // 1. Get All Parents (with Pagination & Search)
    async getAllParents(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;

        // Build filter condition
        const where: Prisma.ParentWhereInput = {
            ...(search ? {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        };

        // Execute queries in parallel
        const [data, total] = await Promise.all([
            prisma.parent.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' },
                select: {
                    id: true,
                    fullName: true,
                    phone: true,
                    isActive: true,
                    students: {
                        select: {
                            id: true,
                            studentCode: true,
                            fullName: true
                        }
                    }
                    // Exclude password from list
                }
            }),
            prisma.parent.count({ where })
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

    // 2. Get Parent by ID
    async getParentById(id: number): Promise<Parent | null> {
        return prisma.parent.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                phone: true,
                isActive: true,
                students: {
                    select: {
                        id: true,
                        studentCode: true,
                        fullName: true,
                        dob: true,
                        gender: true
                    }
                }
                // Exclude password
            }
        }) as Promise<Parent | null>;
    }

    // 3. Create Parent (with password)
    async createParent(data: any): Promise<Parent> {
        // Check if phone exists
        const existing = await prisma.parent.findUnique({
            where: { phone: data.phone }
        });
        if (existing) {
            throw new ApiError(409, 'Phone number already exists');
        }

        // Hash password if provided
        let hashedPassword = null;
        if (data.password) {
            hashedPassword = await bcrypt.hash(data.password, 10);
        }

        return prisma.parent.create({
            data: {
                fullName: data.fullName,
                phone: data.phone,
                password: hashedPassword,
                isActive: data.isActive ?? true
            },
            select: {
                id: true,
                fullName: true,
                phone: true,
                password: true,
                isActive: true,
                students: true
            }
        });
    }

    // 4. Update Parent (excluding password)
    async updateParent(id: number, data: any): Promise<Parent> {
        return prisma.parent.update({
            where: { id },
            data: {
                fullName: data.fullName,
                phone: data.phone,
                isActive: data.isActive
            },
            select: {
                id: true,
                fullName: true,
                phone: true,
                password: true,
                isActive: true,
                students: true
            }
        });
    }

    // 5. Reset Password
    async resetPassword(id: number, newPassword: string): Promise<Parent> {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        return prisma.parent.update({
            where: { id },
            data: { password: hashedPassword },
            select: {
                id: true,
                fullName: true,
                phone: true,
                password: true,
                isActive: true,
                students: true
            }
        });
    }

    // 6. Get Children (Students) of a Parent
    async getChildren(parentId: number) {
        const parent = await prisma.parent.findUnique({
            where: { id: parentId },
            include: {
                students: {
                    select: {
                        id: true,
                        studentCode: true,
                        fullName: true,
                        dob: true,
                        gender: true,
                        enrollments: {
                            include: {
                                class: {
                                    include: {
                                        grade: true,
                                        academicYear: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!parent) {
            throw new ApiError(404, 'Parent not found');
        }

        return parent.students;
    }

    // 7. Delete Parent (with cascade handling)
    async deleteParent(id: number): Promise<Parent> {
        // First, set parentId to null for all students of this parent
        await prisma.student.updateMany({
            where: { parentId: id },
            data: { parentId: null }
        });

        // Then delete the parent
        return prisma.parent.delete({
            where: { id }
        });
    }
}
