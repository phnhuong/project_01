import { Class, ClassEnrollment, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class ClassesService {
    // 1. Get All Classes
    async getAllClasses(academicYearId?: number, gradeId?: number): Promise<any[]> {
        return prisma.class.findMany({
            where: {
                academicYearId,
                gradeId
            },
            include: {
                grade: true,
                academicYear: true,
                homeroomTeacher: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                _count: {
                    select: { enrollments: true }
                }
            }
        });
    }

    // 2. Get Class by ID
    async getClassById(id: number): Promise<any> {
        return prisma.class.findUnique({
            where: { id },
            include: {
                grade: true,
                academicYear: true,
                homeroomTeacher: {
                    select: {
                        id: true,
                        fullName: true
                    }
                },
                enrollments: {
                    include: {
                        student: true
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
                homeroomTeacherId: data.homeroomTeacherId
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
        // Check for enrollments
        const enrollmentCount = await prisma.classEnrollment.count({
            where: { classId: id }
        });

        if (enrollmentCount > 0) {
            throw new ApiError(400, 'Cannot delete class with existing enrollments');
        }

        return prisma.class.delete({
            where: { id }
        });
    }

    // 6. Enroll Student
    async enrollStudent(classId: number, studentId: number): Promise<ClassEnrollment> {
        return prisma.classEnrollment.create({
            data: {
                classId,
                studentId
            }
        });
    }

    // 7. Remove Student from Class
    async removeStudent(classId: number, studentId: number): Promise<void> {
        const enrollment = await prisma.classEnrollment.findUnique({
            where: {
                studentId_classId: {
                    classId,
                    studentId
                }
            }
        });

        if (!enrollment) {
            throw new ApiError(404, 'Enrollment not found');
        }

        await prisma.classEnrollment.delete({
            where: { id: enrollment.id }
        });
    }
}
