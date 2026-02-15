import { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service';
import { asyncHandler } from '../utils/asyncHandler';

const reportsService = new ReportsService();

export class ReportsController {
    getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
        const stats = await reportsService.getDashboardStats();
        res.json(stats);
    });

    getHierarchicalData = asyncHandler(async (req: Request, res: Response) => {
        const yearId = req.query.yearId ? parseInt(req.query.yearId as string) : undefined;
        const gradeId = req.query.gradeId ? parseInt(req.query.gradeId as string) : undefined;
        const classId = req.query.classId ? parseInt(req.query.classId as string) : undefined;

        const data = await reportsService.getHierarchicalData(yearId, gradeId, classId);
        res.json(data);
    });

    getPerformanceReport = asyncHandler(async (req: Request, res: Response) => {
        const yearId = req.query.yearId ? parseInt(req.query.yearId as string) : undefined;
        const gradeId = req.query.gradeId ? parseInt(req.query.gradeId as string) : undefined;
        const semester = req.query.semester ? parseInt(req.query.semester as string) : undefined;

        const data = await reportsService.getPerformanceReport({ yearId, gradeId, semester });
        res.json(data);
    });
}
