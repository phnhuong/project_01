import { Grade, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class GradesService {
    // 1. Get All Grades
    async getAllGrades(): Promise<Grade[]> {
        return prisma.grade.findMany({
            orderBy: { level: 'asc' }
        });
    }

    // 2. Get Grade by ID
    async getGradeById(id: number): Promise<Grade | null> {
        return prisma.grade.findUnique({
            where: { id }
        });
    }

    // 3. Create Grade
    async createGrade(data: any): Promise<Grade> {
        const existing = await prisma.grade.findUnique({
            where: { name: data.name }
        });
        if (existing) {
            throw new ApiError(409, 'Grade name already exists');
        }

        return prisma.grade.create({
            data: {
                name: data.name,
                level: data.level
            }
        });
    }

    // 4. Update Grade
    async updateGrade(id: number, data: any): Promise<Grade> {
        return prisma.grade.update({
            where: { id },
            data: {
                name: data.name,
                level: data.level
            }
        });
    }

    // 5. Delete Grade
    async deleteGrade(id: number): Promise<Grade> {
        // Check if there are classes using this grade
        const classCount = await prisma.class.count({
            where: { gradeId: id }
        });

        if (classCount > 0) {
            throw new ApiError(400, 'Cannot delete grade with existing classes');
        }

        return prisma.grade.delete({
            where: { id }
        });
    }
}
