import { Score, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class ScoresService {
    // 1. Get All Scores (with filters)
    async getAllScores(classId?: number, studentId?: number, subjectId?: number) {
        // Build where clause considering Score uses enrollmentId
        const where: Prisma.ScoreWhereInput = {
            ...(subjectId ? { subjectId } : {}),
            ...(classId || studentId ? {
                enrollment: {
                    ...(classId ? { classId } : {}),
                    ...(studentId ? { studentId } : {})
                }
            } : {})
        };

        return prisma.score.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        code: true,
                        name: true
                    }
                },
                enrollment: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                studentCode: true,
                                fullName: true
                            }
                        },
                        class: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                { enrollmentId: 'asc' },
                { subjectId: 'asc' }
            ]
        });
    }

    // 2. Get Score by ID
    async getScoreById(id: number) {
        return prisma.score.findUnique({
            where: { id },
            include: {
                subject: true,
                enrollment: {
                    include: {
                        student: true,
                        class: true
                    }
                }
            }
        });
    }

    // 3. Create Score
    async createScore(data: any): Promise<Score> {
        // Find enrollment by classId and studentId
        const enrollment = await prisma.classEnrollment.findFirst({
            where: {
                classId: data.classId,
                studentId: data.studentId
            }
        });

        if (!enrollment) {
            throw new Error('Student is not enrolled in this class');
        }

        // Validate score value (0-10)
        if (data.value < 0 || data.value > 10) {
            throw new Error('Score value must be between 0 and 10');
        }

        return prisma.score.create({
            data: {
                enrollmentId: enrollment.id,
                subjectId: data.subjectId,
                type: data.scoreType || data.type, // Support both field names
                value: data.value,
                semester: data.semester || 1, // Default to semester 1
            }
        });
    }

    // 4. Update Score
    async updateScore(id: number, data: any): Promise<Score> {
        // Validate score value if provided
        if (data.value !== undefined && (data.value < 0 || data.value > 10)) {
            throw new Error('Score value must be between 0 and 10');
        }

        return prisma.score.update({
            where: { id },
            data: {
                type: data.scoreType || data.type, // Support both field names
                value: data.value,
                ...(data.semester ? { semester: data.semester } : {})
            }
        });
    }

    // 5. Delete Score
    async deleteScore(id: number): Promise<Score> {
        return prisma.score.delete({
            where: { id }
        });
    }
}
