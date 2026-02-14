import { Request, Response } from 'express';
import { GradesService } from '../services/grades.service';

const gradesService = new GradesService();

export class GradesController {
    // 1. Get All
    async getGrades(req: Request, res: Response) {
        try {
            const grades = await gradesService.getAllGrades();
            res.json(grades);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 2. Get Detail
    async getGrade(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }
            const grade = await gradesService.getGradeById(id);
            if (!grade) {
                res.status(404).json({ message: 'Grade not found' });
                return;
            }
            res.json(grade);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 3. Create
    async createGrade(req: Request, res: Response) {
        try {
            if (!req.body.name || !req.body.level) {
                res.status(400).json({ message: 'Missing required fields (name, level)' });
                return;
            }

            const newGrade = await gradesService.createGrade(req.body);
            res.status(201).json(newGrade);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Grade name already exists' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 4. Update
    async updateGrade(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            const updatedGrade = await gradesService.updateGrade(id, req.body);
            res.json(updatedGrade);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Grade not found' });
                return;
            }
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Grade name already exists' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 5. Delete
    async deleteGrade(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            await gradesService.deleteGrade(id);
            res.json({ message: 'Grade deleted successfully' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Grade not found' });
                return;
            }
            if (error.message === 'Cannot delete grade with existing classes') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
