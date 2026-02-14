import { Score, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class ScoresService {
    // 1. Get All Scores (with filters)
    async getAllScores(classId?: number, studentId?: number, subjectId?: number): Promise<any[]> {
        return prisma.score.findMany({
            where: {
                enrollment: {
                    classId,
                    studentId
                },
                subjectId
            },
            include: {
                enrollment: {
                    include: {
                        student: {
                            select: {
                                fullName: true,
                                studentCode: true
                            }
                        },
                        class: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        });
    }

    // 2. Get Score by ID
    async getScoreById(id: number): Promise<any> {
        return prisma.score.findUnique({
            where: { id },
            include: {
                enrollment: {
                    include: {
                        student: true,
                        class: true
                    }
                },
                subject: true
            }
        });
    }

    // 3. Create Score
    async createScore(data: any): Promise<Score> {
        // Check if student is enrolled in this class
        const enrollment = await prisma.classEnrollment.findUnique({
            where: {
                studentId_classId: {
                    classId: data.classId,
                    studentId: data.studentId
                }
            }
        });

        if (!enrollment) {
            throw new ApiError(400, 'Student is not enrolled in this class');
        }

        // Validate score value range
        const scoreValue = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
        if (scoreValue < 0 || scoreValue > 10) {
            throw new ApiError(400, 'Score value must be between 0 and 10');
        }

        return prisma.score.create({
            data: {
                enrollmentId: enrollment.id,
                subjectId: data.subjectId,
                type: data.scoreType,
                value: scoreValue,
                semester: data.semester || 1
            }
        });
    }

    // 4. Update Score
    async updateScore(id: number, data: any): Promise<Score> {
        // Validate score value range if provided
        if (data.value !== undefined) {
            const scoreValue = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
            if (scoreValue < 0 || scoreValue > 10) {
                throw new ApiError(400, 'Score value must be between 0 and 10');
            }
            data.value = scoreValue;
        }

        return prisma.score.update({
            where: { id },
            data: {
                type: data.scoreType,
                value: data.value,
                semester: data.semester
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
