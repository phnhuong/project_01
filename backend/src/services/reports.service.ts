import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class ReportsService {
    // 1. Dashboard Statistics
    async getDashboardStats() {
        const [studentCount, classCount, subjectCount, teacherCount] = await Promise.all([
            prisma.student.count(),
            prisma.class.count(),
            prisma.subject.count(),
            prisma.user.count({ where: { systemRoles: { has: 'TEACHER' } } })
        ]);

        // Student distribution by Grade
        const studentByGrade = await prisma.grade.findMany({
            include: {
                _count: {
                    select: {
                        classes: {
                            // Sum of students in all classes of this grade
                        }
                    }
                },
                classes: {
                    include: {
                        _count: {
                            select: { enrollments: true }
                        }
                    }
                }
            }
        });

        const gradeDistribution = studentByGrade.map(g => ({
            name: g.name,
            studentCount: g.classes.reduce((sum, c) => sum + c._count.enrollments, 0)
        }));

        return {
            totalStudents: studentCount,
            totalClasses: classCount,
            totalSubjects: subjectCount,
            totalTeachers: teacherCount,
            gradeDistribution
        };
    }

    // 2. Hierarchical Exploration
    async getHierarchicalData(yearId?: number, gradeId?: number, classId?: number) {
        if (classId) {
            // Detailed Class Info
            return prisma.class.findUnique({
                where: { id: classId },
                include: {
                    grade: true,
                    academicYear: true,
                    homeroomTeacher: {
                        select: { id: true, fullName: true }
                    },
                    enrollments: {
                        include: {
                            student: {
                                include: {
                                    parent: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: { enrollments: true }
                    }
                }
            });
        }

        if (gradeId) {
            // Classes within a Grade
            return prisma.class.findMany({
                where: { gradeId },
                include: {
                    _count: {
                        select: { enrollments: true }
                    },
                    homeroomTeacher: {
                        select: { id: true, fullName: true }
                    }
                }
            });
        }

        if (yearId) {
            // Grades within a Year
            const grades = await prisma.grade.findMany({
                where: { academicYearId: yearId },
                include: {
                    classes: {
                        include: {
                            _count: {
                                select: { enrollments: true }
                            }
                        }
                    }
                }
            });

            return grades.map(g => ({
                id: g.id,
                name: g.name,
                level: g.level,
                classCount: g.classes.length,
                studentCount: g.classes.reduce((sum, c) => sum + c._count.enrollments, 0)
            }));
        }

        // Default: List of Years
        const years = await prisma.academicYear.findMany({
            orderBy: { startDate: 'desc' },
            include: {
                _count: {
                    select: { classes: true, grades: true }
                }
            }
        });

        // Add student count per year
        const results = await Promise.all(years.map(async (y) => {
            const studentCount = await prisma.classEnrollment.count({
                where: {
                    class: {
                        academicYearId: y.id
                    }
                }
            });
            return {
                ...y,
                studentCount
            };
        }));

        return results;
    }

    // 3. Performance Metrics (Subject-wise)
    async getPerformanceReport(params: { yearId?: number, gradeId?: number, semester?: number }) {
        const where: any = {};
        if (params.yearId) where.enrollment = { class: { academicYearId: params.yearId } };
        if (params.gradeId) {
            if (!where.enrollment) where.enrollment = { class: {} };
            where.enrollment.class.gradeId = params.gradeId;
        }
        if (params.semester) where.semester = params.semester;

        const scores = await prisma.score.findMany({
            where,
            include: {
                subject: true
            }
        });

        // Group by subject and calculate average
        const subjectStats = new Map<string, { total: number, count: number }>();

        scores.forEach(s => {
            const val = Number(s.value);
            const current = subjectStats.get(s.subject.name) || { total: 0, count: 0 };
            subjectStats.set(s.subject.name, {
                total: current.total + val,
                count: current.count + 1
            });
        });

        return Array.from(subjectStats.entries()).map(([name, stat]) => ({
            subject: name,
            average: Math.round((stat.total / stat.count) * 100) / 100,
            count: stat.count
        }));
    }
}
