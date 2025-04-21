import express from 'express';
import {
  getAllMembers,
  getMemberById,
  getMemberByUserId,
  createMember,
  updateMember,
  getMemberPayments,
  getMemberLoans,
  getFinancialSummary,
} from '../controllers/member.controller';
import { verifyToken } from '../middleware/auth';
import { isAdminOrSuperAdmin, canAccessMember } from '../middleware/permission';

const router = express.Router();

// Admin routes - specific routes first
router.get(
  '/financial-summary',
  verifyToken,
  isAdminOrSuperAdmin,
  getFinancialSummary
);
router.get('/user/:userId', verifyToken, canAccessMember, getMemberByUserId); // Get member Profile by userId

// Generic admin routes
router.get('/', verifyToken, isAdminOrSuperAdmin, getAllMembers); // Get all members Profile
router.post('/', verifyToken, isAdminOrSuperAdmin, createMember); // Create a new member Profile

// Member specific routes
router.get('/:id/payments', verifyToken, canAccessMember, getMemberPayments);
router.get('/:id/loans', verifyToken, canAccessMember, getMemberLoans);
router.get('/member/:id', verifyToken, canAccessMember, getMemberById);
router.put('/:id', verifyToken, canAccessMember, updateMember); // Update member Profile by Member ID

export default router;
