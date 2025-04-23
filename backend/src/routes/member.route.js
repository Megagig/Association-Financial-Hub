"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const member_controller_1 = require("../controllers/member.controller");
const auth_1 = require("../middleware/auth");
const permission_1 = require("../middleware/permission");
const router = express_1.default.Router();
// Admin routes - specific routes first
router.get('/financial-summary', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, member_controller_1.getFinancialSummary);
router.get('/user/:userId', auth_1.verifyToken, permission_1.canAccessMember, member_controller_1.getMemberByUserId); // Get member Profile by userId
// Generic admin routes
router.get('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, member_controller_1.getAllMembers); // Get all members Profile
router.post('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, member_controller_1.createMember); // Create a new member Profile
// Member specific routes
router.get('/:id/payments', auth_1.verifyToken, permission_1.canAccessMember, member_controller_1.getMemberPayments);
router.get('/:id/loans', auth_1.verifyToken, permission_1.canAccessMember, member_controller_1.getMemberLoans);
router.get('/member/:id', auth_1.verifyToken, permission_1.canAccessMember, member_controller_1.getMemberById);
router.put('/:id', auth_1.verifyToken, permission_1.canAccessMember, member_controller_1.updateMember); // Update member Profile by Member ID
exports.default = router;
