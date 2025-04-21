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


const router = express.Router();

// Admin routes
router.get('/',, getAllMembers);
router.post('/', createMember);
router.put('/:id', updateMember);
router.get('/financial-summary',getFinancialSummary);

// Member routes (both admin and member can access)
router.get('/user/:userId', getMemberByUserId);
router.get('/:id', getMemberById);
router.get('/:id/payments', getMemberPayments);
router.get('/:id/loans', getMemberLoans);

export default router;
