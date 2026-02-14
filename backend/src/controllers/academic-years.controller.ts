import { Request, Response } from 'express';
import { AcademicYearsService } from '../services/academic-years.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const academicYearsService = new AcademicYearsService();

export class AcademicYearsController {
    // 1. Get All
    getAcademicYears = asyncHandler(async (req: Request, res: Response) => {
        const academicYears = await academicYearsService.getAllAcademicYears();
        res.json(academicYears);
    });

    // 2. Get Active Academic Year
    getActiveAcademicYear = asyncHandler(async (req: Request, res: Response) => {
        const activeYear = await academicYearsService.getActiveAcademicYear();
        if (!activeYear) {
            throw new ApiError(404, 'No active academic year found');
        }
        res.json(activeYear);
    });

    // 3. Get Detail
    getAcademicYear = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        const academicYear = await academicYearsService.getAcademicYearById(id);
        if (!academicYear) {
            throw new ApiError(404, 'Academic year not found');
        }
        res.json(academicYear);
    });

    // 4. Create
    createAcademicYear = asyncHandler(async (req: Request, res: Response) => {
        const newAcademicYear = await academicYearsService.createAcademicYear(req.body);
        res.status(201).json(newAcademicYear);
    });

    // 5. Update
    updateAcademicYear = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await academicYearsService.getAcademicYearById(id);
        if (!existing) {
            throw new ApiError(404, 'Academic year not found');
        }
        const updatedAcademicYear = await academicYearsService.updateAcademicYear(id, req.body);
        res.json(updatedAcademicYear);
    });

    // 6. Delete
    deleteAcademicYear = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await academicYearsService.getAcademicYearById(id);
        if (!existing) {
            throw new ApiError(404, 'Academic year not found');
        }
        await academicYearsService.deleteAcademicYear(id);
        res.json({ message: 'Academic year deleted successfully' });
    });
}
