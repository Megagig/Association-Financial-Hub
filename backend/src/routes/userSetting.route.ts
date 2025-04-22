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

// Admin and member only routes
router.get('/user/:id', verifyToken, getUserSettings);
router.post('/', verifyToken, changePassword);
router.post('/:id', verifyToken, updateProfile);
router.get('/userId', verifyToken, updateUserSettings);

//superadmin only
router.post('/:id', verifyToken, isSuperAdmin, updateUserRole);
router.get('/', verifyToken, isSuperAdmin, getAllUsers);

export default router;
