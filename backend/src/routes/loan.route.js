"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loan_controller_1 = require("../controllers/loan.controller");
const auth_1 = require("../middleware/auth");
const permission_1 = require("../middleware/permission");
const router = express_1.default.Router();
// Admin routes
router.get('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, loan_controller_1.getAllLoans);
router.put('/:id/status', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, loan_controller_1.updateLoanStatus);
// Member routes (both admin and member can access)
router.post('/apply', auth_1.verifyToken, loan_controller_1.applyForLoan);
router.get('/:id', auth_1.verifyToken, loan_controller_1.getLoanById);
router.get('/user/:userId', auth_1.verifyToken, loan_controller_1.getUserLoanHistory);
exports.default = router;
