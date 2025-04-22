import express from 'express';
import {
  getUserSettings,
  changePassword,
  updateProfile,
  updateUserSettings,
  updateUserRole,
  getAllUsers,
} from '../controllers/userSetting.controller';
import { verifyToken, isSuperAdmin } from '../middleware/auth';

const router = express.Router();
// User routes
router.get('/settings/:userId', verifyToken, getUserSettings);
router.put('/settings/:userId', verifyToken, updateUserSettings);
router.put('/profile/:userId', verifyToken, updateProfile);
router.post('/change-password/:userId', verifyToken, changePassword);

// Admin routes
router.get('/admin/users', verifyToken, isSuperAdmin, getAllUsers);
router.put(
  '/admin/users/:userId/role',
  verifyToken,
  isSuperAdmin,
  updateUserRole
);
export default router;
