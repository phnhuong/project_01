import { Request, Response } from 'express';
import { ScoresService } from '../services/scores.service';

const scoresService = new ScoresService();

export class ScoresController {
    // 1. Get All (with filters)
    async getScores(req: Request, res: Response) {
        try {
            const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;
            const studentId = req.query.studentId ? parseInt(req.query.studentId as string) : undefined;
            const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;

            const scores = await scoresService.getAllScores(classId, studentId, subjectId);
            res.json(scores);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 2. Get Detail
    async getScore(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }
            const score = await scoresService.getScoreById(id);
            if (!score) {
                res.status(404).json({ message: 'Score not found' });
                return;
            }
            res.json(score);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 3. Create
    async createScore(req: Request, res: Response) {
        try {
            const { studentId, subjectId, classId, scoreType, value } = req.body;

            if (!studentId || !subjectId || !classId || !scoreType || value === undefined) {
                res.status(400).json({ message: 'Missing required fields (studentId, subjectId, classId, scoreType, value)' });
                return;
            }

            const newScore = await scoresService.createScore(req.body);
            res.status(201).json(newScore);
        } catch (error: any) {
            console.error(error);
            if (error.message === 'Student is not enrolled in this class') {
                res.status(400).json({ message: error.message });
                return;
            }
            if (error.message === 'Score value must be between 0 and 10') {
                res.status(400).json({ message: error.message });
                return;
            }
            if (error.code === 'P2003') {
                res.status(400).json({ message: 'Invalid studentId, subjectId, or classId' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 4. Update
    async updateScore(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            const updatedScore = await scoresService.updateScore(id, req.body);
            res.json(updatedScore);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Score not found' });
                return;
            }
            if (error.message === 'Score value must be between 0 and 10') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 5. Delete
    async deleteScore(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            await scoresService.deleteScore(id);
            res.json({ message: 'Score deleted successfully' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Score not found' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
