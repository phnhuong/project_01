import { Request, Response } from 'express';
import { AcademicYearsService } from '../services/academic-years.service';

const academicYearsService = new AcademicYearsService();

export class AcademicYearsController {
    // 1. Get All
    async getAcademicYears(req: Request, res: Response) {
        try {
            const academicYears = await academicYearsService.getAllAcademicYears();
            res.json(academicYears);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 2. Get Active Academic Year
    async getActiveAcademicYear(req: Request, res: Response) {
        try {
            const activeYear = await academicYearsService.getActiveAcademicYear();
            if (!activeYear) {
                res.status(404).json({ message: 'No active academic year found' });
                return;
            }
            res.json(activeYear);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 3. Get Detail
    async getAcademicYear(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }
            const academicYear = await academicYearsService.getAcademicYearById(id);
            if (!academicYear) {
                res.status(404).json({ message: 'Academic year not found' });
                return;
            }
            res.json(academicYear);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 4. Create
    async createAcademicYear(req: Request, res: Response) {
        try {
            if (!req.body.name || !req.body.startDate || !req.body.endDate) {
                res.status(400).json({ message: 'Missing required fields (name, startDate, endDate)' });
                return;
            }

            const newAcademicYear = await academicYearsService.createAcademicYear(req.body);
            res.status(201).json(newAcademicYear);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Academic year name already exists' });
                return;
            }
            if (error.message === 'Start date must be before end date') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 5. Update
    async updateAcademicYear(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            const updatedAcademicYear = await academicYearsService.updateAcademicYear(id, req.body);
            res.json(updatedAcademicYear);
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Academic year not found' });
                return;
            }
            if (error.code === 'P2002') {
                res.status(409).json({ message: 'Academic year name already exists' });
                return;
            }
            if (error.message === 'Start date must be before end date') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    // 6. Delete
    async deleteAcademicYear(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid ID' });
                return;
            }

            await academicYearsService.deleteAcademicYear(id);
            res.json({ message: 'Academic year deleted successfully' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'P2025') {
                res.status(404).json({ message: 'Academic year not found' });
                return;
            }
            if (error.message === 'Cannot delete academic year with existing classes') {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
