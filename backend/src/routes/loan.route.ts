import express from 'express';
import {
  getAllLoans,
  getLoanById,
  applyForLoan,
  updateLoanStatus,
  getUserLoanHistory,
} from '../controllers/loan.controller';

import { verifyToken } from '../middleware/auth';
import { isAdminOrSuperAdmin } from '../middleware/permission';

const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdminOrSuperAdmin, getAllLoans);
router.put('/:id/status', verifyToken, isAdminOrSuperAdmin, updateLoanStatus);

// Member routes (both admin and member can access)
router.post('/apply', verifyToken, applyForLoan);
router.get('/:id', verifyToken, getLoanById);
router.get('/user/:userId', verifyToken, getUserLoanHistory);

export default router;
