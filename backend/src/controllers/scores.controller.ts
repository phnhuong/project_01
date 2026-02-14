import { Request, Response } from 'express';
import { ScoresService } from '../services/scores.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const scoresService = new ScoresService();

export class ScoresController {
    // 1. Get All (with filters)
    getScores = asyncHandler(async (req: Request, res: Response) => {
        const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
        const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
        const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;

        const scores = await scoresService.getAllScores(classId, studentId, subjectId);
        res.json(scores);
    });

    // 2. Get Detail
    getScore = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        const score = await scoresService.getScoreById(id);
        if (!score) {
            throw new ApiError(404, 'Score not found');
        }
        res.json(score);
    });

    // 3. Create
    createScore = asyncHandler(async (req: Request, res: Response) => {
        const newScore = await scoresService.createScore(req.body);
        res.status(201).json(newScore);
    });

    // 4. Update
    updateScore = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await scoresService.getScoreById(id);
        if (!existing) {
            throw new ApiError(404, 'Score not found');
        }
        const updatedScore = await scoresService.updateScore(id, req.body);
        res.json(updatedScore);
    });

    // 5. Delete
    deleteScore = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await scoresService.getScoreById(id);
        if (!existing) {
            throw new ApiError(404, 'Score not found');
        }
        await scoresService.deleteScore(id);
        res.json({ message: 'Score deleted successfully' });
    });
}
