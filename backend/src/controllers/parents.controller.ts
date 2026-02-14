import { Request, Response } from 'express';
import { ParentsService } from '../services/parents.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const parentsService = new ParentsService();

export class ParentsController {
    // 1. Get List
    getParents = asyncHandler(async (req: Request, res: Response) => {
        const page = req.query.page ? parseInt(req.query.page as string) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const search = req.query.search as string;

        const result = await parentsService.getAllParents(page, limit, search);
        res.json(result);
    });

    // 2. Get Detail
    getParent = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        const parent = await parentsService.getParentById(id);
        if (!parent) {
            throw new ApiError(404, 'Parent not found');
        }
        res.json(parent);
    });

    // 3. Create
    createParent = asyncHandler(async (req: Request, res: Response) => {
        const newParent = await parentsService.createParent(req.body);
        res.status(201).json(newParent);
    });

    // 4. Update
    updateParent = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await parentsService.getParentById(id);
        if (!existing) {
            throw new ApiError(404, 'Parent not found');
        }
        const updatedParent = await parentsService.updateParent(id, req.body);
        res.json(updatedParent);
    });

    // 5. Delete
    deleteParent = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id as string);
        // Check if exists
        const existing = await parentsService.getParentById(id);
        if (!existing) {
            throw new ApiError(404, 'Parent not found');
        }
        await parentsService.deleteParent(id);
        res.json({ message: 'Parent deleted successfully' });
    });
}
