"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("../controllers/report.controller");
const auth_1 = require("../middleware/auth");
const permission_1 = require("../middleware/permission");
const router = express_1.default.Router();
// Admin routes (all report routes are admin-only)
router.get('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, report_controller_1.getAllReports);
router.post('/', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, report_controller_1.generateReport);
router.get('/:id', auth_1.verifyToken, permission_1.isAdminOrSuperAdmin, report_controller_1.getReportById);
exports.default = router;
