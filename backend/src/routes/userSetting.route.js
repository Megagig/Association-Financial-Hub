"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSetting_controller_1 = require("../controllers/userSetting.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// User routes
router.get('/settings/:userId', auth_1.verifyToken, userSetting_controller_1.getUserSettings);
router.put('/settings/:userId', auth_1.verifyToken, userSetting_controller_1.updateUserSettings);
router.put('/profile/:userId', auth_1.verifyToken, userSetting_controller_1.updateProfile);
router.post('/change-password/:userId', auth_1.verifyToken, userSetting_controller_1.changePassword);
// Admin routes
router.get('/admin/users', auth_1.verifyToken, auth_1.isSuperAdmin, userSetting_controller_1.getAllUsers);
router.put('/admin/users/:userId/role', auth_1.verifyToken, auth_1.isSuperAdmin, userSetting_controller_1.updateUserRole);
exports.default = router;
