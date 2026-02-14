import { Subject, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class SubjectsService {
    // 1. Get All Subjects
    async getAllSubjects(): Promise<Subject[]> {
        return prisma.subject.findMany({
            orderBy: { name: 'asc' }
        });
    }

    // 2. Get Subject by ID
    async getSubjectById(id: number): Promise<Subject | null> {
        return prisma.subject.findUnique({
            where: { id }
        });
    }

    // 3. Create Subject
    async createSubject(data: any): Promise<Subject> {
        const existing = await prisma.subject.findUnique({
            where: { code: data.code }
        });
        if (existing) {
            throw new ApiError(409, 'Subject code already exists');
        }

        return prisma.subject.create({
            data: {
                code: data.code,
                name: data.name
            }
        });
    }

    // 4. Update Subject
    async updateSubject(id: number, data: any): Promise<Subject> {
        return prisma.subject.update({
            where: { id },
            data: {
                code: data.code,
                name: data.name
            }
        });
    }

    // 5. Delete Subject
    async deleteSubject(id: number): Promise<Subject> {
        // Check if there are assignments or scores using this subject
        const scoreCount = await prisma.score.count({
            where: { subjectId: id }
        });

        // Add check for assignments if that table exists/is used
        if (scoreCount > 0) {
            throw new ApiError(400, 'Cannot delete subject with existing assignments or scores');
        }

        return prisma.subject.delete({
            where: { id }
        });
    }
}
