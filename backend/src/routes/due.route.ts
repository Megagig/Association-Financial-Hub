// import express from 'express';
// import {
//   getAllDues,
//   getDueById,
//   createDue,
//   updateDueStatus,
//   getUserDues,
// } from '../controllers/due.controller';
// import { verifyToken } from '../middleware/auth';
// import { isAdminOrSuperAdmin } from '../middleware/permission';

// const router = express.Router();

// // Admin routes
// router.get('/', verifyToken, isAdminOrSuperAdmin, getAllDues);
// router.post('/', verifyToken, isAdminOrSuperAdmin, createDue);
// router.put('/:id/status', verifyToken, isAdminOrSuperAdmin, updateDueStatus);

// // Member routes (both admin and member can access)
// router.get('/:id', verifyToken, getDueById);
// router.get('/user/:userId', verifyToken, getUserDues);

// export default router;

import express from 'express';
import {
  getAllDues,
  getDueById,
  createDue,
  updateDueStatus,
  getUserDues,
  bulkCreateDues,
  bulkUpdateDueStatus,
  softDeleteDue,
  softDeleteMultipleDues,
  restoreSoftDeletedDue,
  getSoftDeletedDues,
} from '../controllers/due.controller';
import { verifyToken } from '../middleware/auth';
import { isAdminOrSuperAdmin } from '../middleware/permission';

const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdminOrSuperAdmin, getAllDues);
router.post('/', verifyToken, isAdminOrSuperAdmin, createDue);
router.put('/:id/status', verifyToken, isAdminOrSuperAdmin, updateDueStatus);

// Bulk operation routes (admin only)
router.post('/bulk/create', verifyToken, isAdminOrSuperAdmin, bulkCreateDues);
router.put(
  '/bulk/status',
  verifyToken,
  isAdminOrSuperAdmin,
  bulkUpdateDueStatus
);
// Soft delete routes (admin only)
router.delete('/:id/soft', verifyToken, isAdminOrSuperAdmin, softDeleteDue);
router.delete(
  '/bulk/soft',
  verifyToken,
  isAdminOrSuperAdmin,
  softDeleteMultipleDues
);
router.post(
  '/bulk/soft-delete',
  verifyToken,
  isAdminOrSuperAdmin,
  restoreSoftDeletedDue
);

router.get(
  '/bulk/soft-delete',
  verifyToken,
  isAdminOrSuperAdmin,
  getSoftDeletedDues
);

// Member routes (both admin and member can access)
router.get('/:id', verifyToken, getDueById);
router.get('/user/:userId', verifyToken, getUserDues);

export default router;
