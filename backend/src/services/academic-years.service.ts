import { AcademicYear, Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class AcademicYearsService {
    // 1. Get All Academic Years
    async getAllAcademicYears() {
        return prisma.academicYear.findMany({
            orderBy: { startDate: 'desc' }
        });
    }

    // 2. Get Academic Year by ID
    async getAcademicYearById(id: number): Promise<AcademicYear | null> {
        return prisma.academicYear.findUnique({
            where: { id }
        });
    }

    // 3. Get Active Academic Year
    async getActiveAcademicYear(): Promise<AcademicYear | null> {
        return prisma.academicYear.findFirst({
            where: { isCurrent: true }
        });
    }

    // 4. Create Academic Year
    async createAcademicYear(data: any): Promise<AcademicYear> {
        // Validate dates
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (startDate >= endDate) {
            throw new ApiError(400, 'Start date must be before end date');
        }

        // If creating as active, deactivate all others first
        if (data.isCurrent) {
            await prisma.academicYear.updateMany({
                where: { isCurrent: true },
                data: { isCurrent: false }
            });
        }

        // Check for duplicate name
        const existing = await prisma.academicYear.findUnique({
            where: { name: data.name }
        });
        if (existing) {
            throw new ApiError(409, 'Academic year name already exists');
        }

        return prisma.academicYear.create({
            data: {
                name: data.name,
                startDate,
                endDate,
                isCurrent: data.isCurrent || false
            }
        });
    }

    // 5. Update Academic Year
    async updateAcademicYear(id: number, data: any): Promise<AcademicYear> {
        // Validate dates if provided
        if (data.startDate && data.endDate) {
            const startDate = new Date(data.startDate);
            const endDate = new Date(data.endDate);

            if (startDate >= endDate) {
                throw new ApiError(400, 'Start date must be before end date');
            }
        }

        // If setting this one as active, deactivate all others first
        if (data.isCurrent === true) {
            await prisma.academicYear.updateMany({
                where: {
                    isCurrent: true,
                    NOT: { id }
                },
                data: { isCurrent: false }
            });
        }

        return prisma.academicYear.update({
            where: { id },
            data: {
                name: data.name,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                isCurrent: data.isCurrent
            }
        });
    }

    // 6. Delete Academic Year
    async deleteAcademicYear(id: number): Promise<AcademicYear> {
        // Check if there are classes using this academic year
        const classCount = await prisma.class.count({
            where: { academicYearId: id }
        });

        if (classCount > 0) {
            throw new ApiError(400, 'Cannot delete academic year with existing classes');
        }

        return prisma.academicYear.delete({
            where: { id }
        });
    }
}
