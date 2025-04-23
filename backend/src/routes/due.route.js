"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// // Admin routes
// router.get('/', verifyToken, isAdminOrSuperAdmin, getAllDues);
// router.post('/', verifyToken, isAdminOrSuperAdmin, createDue);
// router.put('/:id/status', verifyToken, isAdminOrSuperAdmin, updateDueStatus);
// // Member routes (both admin and member can access)
// router.get('/:id', verifyToken, getDueById);
// router.get('/user/:userId', verifyToken, getUserDues);
// export default router;
const express_1 = __importDefault(require("express"));
const due_controller_1 = require("../controllers/due.controller");
const auth_1 = require("../middleware/auth");
const permission_1 = require("../middleware/permission");
const router = express_1.default.Router();
// Admin routes
router.get('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.getAllDues);
router.post('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.createDue);
router.put('/:id/status', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.updateDueStatus);
// Bulk operation routes (admin only)
router.post('/bulk/create', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.bulkCreateDues);
router.put('/bulk/status', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.bulkUpdateDueStatus);
// Soft delete routes (admin only)
router.delete('/:id/soft', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.softDeleteDue);
router.delete('/bulk/soft', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.softDeleteMultipleDues);
router.post('/bulk/soft-delete', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.restoreSoftDeletedDue);
router.get('/bulk/soft-delete', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, due_controller_1.getSoftDeletedDues);
// Member routes (both admin and member can access)
router.get('/:id', auth_1.verifyToken, due_controller_1.getDueById);
router.get('/user/:userId', auth_1.verifyToken, due_controller_1.getUserDues);
exports.default = router;
