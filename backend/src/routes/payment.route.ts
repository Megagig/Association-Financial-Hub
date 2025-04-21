import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  getUserPaymentHistory,
} from '../controllers/payment.controller';
import { verifyToken } from '../middleware/auth';
import { canAccessMember, isAdminOrSuperAdmin } from '../middleware/permission';

const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdminOrSuperAdmin, getAllPayments);
router.put(
  '/:id/status',
  verifyToken,
  isAdminOrSuperAdmin,
  updatePaymentStatus
);

// Member routes (both admin and member can access)
router.post('/', verifyToken, canAccessMember, createPayment); // Create a new payment
router.get(
  '/user/:userId',
  verifyToken,
  canAccessMember,
  getUserPaymentHistory
);
router.get('/:id', verifyToken, canAccessMember, getPaymentById);

export default router;
