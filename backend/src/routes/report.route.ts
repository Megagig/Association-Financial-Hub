import express from 'express';
import {
  getAllReports,
  getReportById,
  generateReport,
} from '../controllers/report.controller';
import { verifyToken } from '../middleware/auth';
import { isAdminOrSuperAdmin } from '../middleware/permission';

const router = express.Router();

// Admin routes (all report routes are admin-only)
router.get('/', verifyToken, isAdminOrSuperAdmin, getAllReports);
router.post('/', verifyToken, isAdminOrSuperAdmin, generateReport);
router.get('/:id', verifyToken, isAdminOrSuperAdmin, getReportById);

export default router;
