import { Request, Response } from 'express';
import { SubjectsService } from '../services/subjects.service';

const subjectsService = new SubjectsService();

export class SubjectsController {
    // 1. Get All
    async getSubjects(req: Request, res: Response) {
        try {
            const subjects = await subjectsService.getAllSubjects();
            res.json(subjects);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 2. Get Detail
    async getSubject(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }
            const subject = await subjectsService.getSubjectById(id);
            if (!subject) {
                res.status(404).json({ message: 'Subject not found' });
                return;
            }
            res.json(subject);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 3. Create
    async createSubject(req: Request, res: Response) {
        try {
            if (!req.body.code || !req.body.name) {
                res.status(400).json({ message: 'Missing required fields (code, name)' });
                return;
            }

            const newSubject = await subjectsService.createSubject(req.body);
            res.status(201).json(newSubject);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Subject code already exists' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 4. Update
    async updateSubject(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            const updatedSubject = await subjectsService.updateSubject(id, req.body);
            res.json(updatedSubject);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Subject not found' });
                return;
            }
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Subject code already exists' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 5. Delete
    async deleteSubject(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            await subjectsService.deleteSubject(id);
            res.json({ message: 'Subject deleted successfully' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Subject not found' });
                return;
            }
            if (error.message === 'Cannot delete subject with existing assignments or scores') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
