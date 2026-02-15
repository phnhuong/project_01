import { Router } from 'express';
import { ReportsController } from '../controllers/reports.controller';

const router = Router();
const reportsController = new ReportsController();

router.get('/dashboard', reportsController.getDashboardStats);
router.get('/hierarchy', reportsController.getHierarchicalData);
router.get('/performance', reportsController.getPerformanceReport);

export default router;
