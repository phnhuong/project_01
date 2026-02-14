import { Parent, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

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
                include: {
                    students: {
                        select: {
                            id: true,
                            studentCode: true,
                            fullName: true
                        }
                    }
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
            include: {
                students: {
                    select: {
                        id: true,
                        studentCode: true,
                        fullName: true,
                        dob: true,
                        gender: true
                    }
                }
            }
        });
    }

    // 3. Create Parent
    async createParent(data: any): Promise<Parent> {
        // Check if phone exists
        const existing = await prisma.parent.findUnique({
            where: { phone: data.phone }
        });
        if (existing) {
            throw new ApiError(409, 'Phone number already exists');
        }

        return prisma.parent.create({
            data: {
                fullName: data.fullName,
                phone: data.phone
            }
        });
    }

    // 4. Update Parent
    async updateParent(id: number, data: any): Promise<Parent> {
        return prisma.parent.update({
            where: { id },
            data: {
                fullName: data.fullName,
                phone: data.phone
            }
        });
    }

    // 5. Delete Parent (with cascade handling)
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
