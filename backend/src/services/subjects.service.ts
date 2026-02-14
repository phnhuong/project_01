import { Subject } from '@prisma/client';
import prisma from '../config/prisma';

export class SubjectsService {
    // 1. Get All Subjects
    async getAllSubjects(): Promise<Subject[]> {
        return prisma.subject.findMany({
            orderBy: { code: 'asc' }
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
        // Check if there are teaching assignments or scores using this subject
        const [assignmentCount, scoreCount] = await Promise.all([
            prisma.teachingAssignment.count({ where: { subjectId: id } }),
            prisma.score.count({ where: { subjectId: id } })
        ]);

        if (assignmentCount > 0 || scoreCount > 0) {
            throw new Error('Cannot delete subject with existing assignments or scores');
        }

        return prisma.subject.delete({
            where: { id }
        });
    }
}
