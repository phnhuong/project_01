import { User } from '@prisma/client';
import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';

export class UsersService {
    // Lấy danh sách tất cả users (bỏ qua password để bảo mật)
    // Lấy danh sách tất cả users (bỏ qua password để bảo mật)
    async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {
            isActive: true,
            ...(search ? {
                OR: [
                    { username: { contains: search } }, // Case insensitive depends on DB/Prisma config
                    { fullName: { contains: search } }
                ]
            } : {})
        };

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    systemRoles: true,
                    isActive: true,
                },
                orderBy: { id: 'desc' }
            }),
            prisma.user.count({ where })
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

    // Lấy chi tiết user theo ID
    async getUserById(id: number): Promise<Partial<User> | null> {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                fullName: true,
                systemRoles: true,
                isActive: true,
            }
        });
    }

    // Tạo user mới
    async createUser(data: any): Promise<Partial<User>> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return prisma.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                fullName: data.fullName,
                systemRoles: data.systemRoles || ['TEACHER'],
                isActive: true
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                systemRoles: true,
                isActive: true,
            }
        });
    }

    // Cập nhật user
    async updateUser(id: number, data: any): Promise<Partial<User>> {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        return prisma.user.update({
            where: { id },
            data: {
                username: data.username,
                password: data.password,
                fullName: data.fullName,
                systemRoles: data.systemRoles,
                isActive: data.isActive
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                systemRoles: true,
                isActive: true,
            }
        });
    }

    // Xóa user (Soft Delete)
    async deleteUser(id: number): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: { isActive: false }
        });
    }
}
