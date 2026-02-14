import { Request, Response } from 'express';
import { ParentsService } from '../services/parents.service';

const parentsService = new ParentsService();

export class ParentsController {
    // 1. Get List
    async getParents(req: Request, res: Response) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const search = req.query.search as string;

            const result = await parentsService.getAllParents(page, limit, search);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 2. Get Detail
    async getParent(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }
            const parent = await parentsService.getParentById(id);
            if (!parent) {
                res.status(404).json({ message: 'Parent not found' });
                return;
            }
            res.json(parent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 3. Create
    async createParent(req: Request, res: Response) {
        try {
            if (!req.body.fullName || !req.body.phone) {
                res.status(400).json({ message: 'Missing required fields (fullName, phone)' });
                return;
            }

            const newParent = await parentsService.createParent(req.body);
            res.status(201).json(newParent);
        } catch (error: any) {
            console.error(error);
            if (error.message === 'Phone number already exists' || error.code === 'P2002') {
                res.status(409).json({ message: 'Phone number already exists' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 4. Update
    async updateParent(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            const updatedParent = await parentsService.updateParent(id, req.body);
            res.json(updatedParent);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Parent not found' });
                return;
            }
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Phone number already exists' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 5. Delete
    async deleteParent(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            await parentsService.deleteParent(id);
            res.json({ message: 'Parent deleted successfully' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Parent not found' });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
