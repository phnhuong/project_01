import { Request, Response } from 'express';
import { SubjectsService } from '../services/subjects.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const subjectsService = new SubjectsService();

export class SubjectsController {
    // 1. Get All
    getSubjects = asyncHandler(async (req: Request, res: Response) => {
        const subjects = await subjectsService.getAllSubjects();
        res.json(subjects);
    });

    // 2. Get Detail
    getSubject = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        const subject = await subjectsService.getSubjectById(id);
        if (!subject) {
            throw new ApiError(404, 'Subject not found');
        }
        res.json(subject);
    });

    // 3. Create
    createSubject = asyncHandler(async (req: Request, res: Response) => {
        const newSubject = await subjectsService.createSubject(req.body);
        res.status(201).json(newSubject);
    });

    // 4. Update
    updateSubject = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await subjectsService.getSubjectById(id);
        if (!existing) {
            throw new ApiError(404, 'Subject not found');
        }
        const updatedSubject = await subjectsService.updateSubject(id, req.body);
        res.json(updatedSubject);
    });

    // 5. Delete
    deleteSubject = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await subjectsService.getSubjectById(id);
        if (!existing) {
            throw new ApiError(404, 'Subject not found');
        }
        await subjectsService.deleteSubject(id);
        res.json({ message: 'Subject deleted successfully' });
    });
}
