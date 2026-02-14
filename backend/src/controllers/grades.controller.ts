import { Request, Response } from 'express';
import { GradesService } from '../services/grades.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const gradesService = new GradesService();

export class GradesController {
    // 1. Get All
    getGrades = asyncHandler(async (req: Request, res: Response) => {
        const grades = await gradesService.getAllGrades();
        res.json(grades);
    });

    // 2. Get Detail
    getGrade = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        const grade = await gradesService.getGradeById(id);
        if (!grade) {
            throw new ApiError(404, 'Grade not found');
        }
        res.json(grade);
    });

    // 3. Create
    createGrade = asyncHandler(async (req: Request, res: Response) => {
        const newGrade = await gradesService.createGrade(req.body);
        res.status(201).json(newGrade);
    });

    // 4. Update
    updateGrade = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await gradesService.getGradeById(id);
        if (!existing) {
            throw new ApiError(404, 'Grade not found');
        }
        const updatedGrade = await gradesService.updateGrade(id, req.body);
        res.json(updatedGrade);
    });

    // 5. Delete
    deleteGrade = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await gradesService.getGradeById(id);
        if (!existing) {
            throw new ApiError(404, 'Grade not found');
        }
        await gradesService.deleteGrade(id);
        res.json({ message: 'Grade deleted successfully' });
    });
}
