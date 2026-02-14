import { Class, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class ClassesService {
    // 1. Get All Classes (with filters and relationships)
    async getAllClasses(academicYearId?: number, gradeId?: number) {
        const where: Prisma.ClassWhereInput = {
            ...(academicYearId ? { academicYearId } : {}),
            ...(gradeId ? { gradeId } : {})
        };

        return prisma.class.findMany({
            where,
            include: {
                grade: true,
                academicYear: true,
                homeroomTeacher: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    // 2. Get Class by ID (with students)
    async getClassById(id: number) {
        return prisma.class.findUnique({
            where: { id },
            include: {
                grade: true,
                academicYear: true,
                homeroomTeacher: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true
                    }
                },
                enrollments: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                studentCode: true,
                                fullName: true,
                                dob: true,
                                gender: true
                            }
                        }
                    }
                }
            }
        });
    }

    // 3. Create Class
    async createClass(data: any): Promise<Class> {
        return prisma.class.create({
            data: {
                name: data.name,
                gradeId: data.gradeId,
                academicYearId: data.academicYearId,
                homeroomTeacherId: data.homeroomTeacherId || null
            }
        });
    }

    // 4. Update Class
    async updateClass(id: number, data: any): Promise<Class> {
        return prisma.class.update({
            where: { id },
            data: {
                name: data.name,
                gradeId: data.gradeId,
                academicYearId: data.academicYearId,
                homeroomTeacherId: data.homeroomTeacherId
            }
        });
    }

    // 5. Delete Class
    async deleteClass(id: number): Promise<Class> {
        // Check if there are enrollments
        const enrollmentCount = await prisma.classEnrollment.count({
            where: { classId: id }
        });

        if (enrollmentCount > 0) {
            throw new Error('Cannot delete class with existing enrollments');
        }

        return prisma.class.delete({
            where: { id }
        });
    }

    // 6. Enroll Student to Class
    async enrollStudent(classId: number, studentId: number) {
        return prisma.classEnrollment.create({
            data: {
                classId,
                studentId
            }
        });
    }

    // 7. Remove Student from Class
    async removeStudent(classId: number, studentId: number) {
        return prisma.classEnrollment.deleteMany({
            where: {
                classId,
                studentId
            }
        });
    }
}
