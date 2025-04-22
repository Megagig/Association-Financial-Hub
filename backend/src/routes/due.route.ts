import express from 'express';
import {
  getAllDues,
  getDueById,
  createDue,
  updateDueStatus,
  getUserDues,
} from '../controllers/due.controller';
import { verifyToken } from '../middleware/auth';
import { isAdminOrSuperAdmin } from '../middleware/permission';

const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdminOrSuperAdmin, getAllDues);
router.post('/', verifyToken, isAdminOrSuperAdmin, createDue);
router.put('/:id/status', verifyToken, isAdminOrSuperAdmin, updateDueStatus);

// Member routes (both admin and member can access)
router.get('/:id', verifyToken, getDueById);
router.get('/user/:userId', verifyToken, getUserDues);

export default router;
