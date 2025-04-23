"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middleware/auth");
const permission_1 = require("../middleware/permission");
const router = express_1.default.Router();
// Admin routes
router.get('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, payment_controller_1.getAllPayments);
router.put('/:id/status', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, payment_controller_1.updatePaymentStatus);
// Member routes (both admin and member can access)
router.post('/', auth_1.verifyToken, permission_1.canAccessMember, payment_controller_1.createPayment); // Create a new payment
router.get('/user/:userId', auth_1.verifyToken, permission_1.canAccessMember, payment_controller_1.getUserPaymentHistory);
router.get('/:id', auth_1.verifyToken, permission_1.canAccessMember, payment_controller_1.getPaymentById);
exports.default = router;
