"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportById = exports.getAllReports = exports.generateReport = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const report_model_1 = require("../models/report.model");
const member_model_1 = require("../models/member.model");
const payment_model_1 = require("../models/payment.model");
const loan_model_1 = require("../models/loan.model");
const user_types_1 = require("../types/user.types");
// Generate a new report
const generateReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, dateRange, type, generatedBy } = req.body;
        // Check if generator exists and is an admin
        const generator = yield user_model_1.default.findById(generatedBy);
        if (!generator ||
            ((_a = generator.role) === null || _a === void 0 ? void 0 : _a.toString()) !== user_types_1.UserRole.ADMIN.toString()) {
            res.status(400).json({ message: 'Invalid generator or not an admin' });
            return;
        }
        // Parse date range
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        // Generate report data based on type
        let reportData = {};
        switch (type) {
            case 'payments': {
                const payments = yield payment_model_1.Payment.find({
                    date: { $gte: fromDate, $lte: toDate },
                }).sort({ date: -1 });
                // Calculate summaries
                const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
                const typeBreakdown = payments.reduce((acc, payment) => {
                    acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
                    return acc;
                }, {});
                const statusBreakdown = payments.reduce((acc, payment) => {
                    acc[payment.status] = (acc[payment.status] || 0) + 1;
                    return acc;
                }, {});
                reportData = {
                    payments,
                    totalAmount,
                    typeBreakdown,
                    statusBreakdown,
                    count: payments.length,
                };
                break;
            }
            case 'dues': {
                // Similar to payments but for dues (implementation would depend on your dues model)
                reportData = {
                    message: 'Dues report implementation would go here',
                };
                break;
            }
            case 'loans': {
                const loans = yield loan_model_1.Loan.find({
                    applicationDate: { $gte: fromDate, $lte: toDate },
                }).sort({ applicationDate: -1 });
                // Calculate summaries
                const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
                const statusBreakdown = loans.reduce((acc, loan) => {
                    acc[loan.status] = (acc[loan.status] || 0) + 1;
                    return acc;
                }, {});
                const approvedAmount = loans
                    .filter((loan) => loan.status === 'approved')
                    .reduce((sum, loan) => sum + loan.amount, 0);
                reportData = {
                    loans,
                    totalAmount,
                    approvedAmount,
                    statusBreakdown,
                    count: loans.length,
                };
                break;
            }
            case 'summary': {
                // Member stats
                const totalMembers = yield member_model_1.Member.countDocuments();
                const newMembers = yield member_model_1.Member.countDocuments({
                    memberSince: { $gte: fromDate, $lte: toDate },
                });
                // Payment stats
                const payments = yield payment_model_1.Payment.find({
                    date: { $gte: fromDate, $lte: toDate },
                });
                const totalPaymentsAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
                const paymentsByType = payments.reduce((acc, payment) => {
                    acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
                    return acc;
                }, {});
                // Loan stats
                const loans = yield loan_model_1.Loan.find({
                    applicationDate: { $gte: fromDate, $lte: toDate },
                });
                const totalLoansAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
                const approvedLoansAmount = loans
                    .filter((loan) => loan.status === 'approved')
                    .reduce((sum, loan) => sum + loan.amount, 0);
                reportData = {
                    period: {
                        from: fromDate,
                        to: toDate,
                    },
                    members: {
                        total: totalMembers,
                        new: newMembers,
                    },
                    payments: {
                        total: totalPaymentsAmount,
                        byType: paymentsByType,
                        count: payments.length,
                    },
                    loans: {
                        total: totalLoansAmount,
                        approved: approvedLoansAmount,
                        count: loans.length,
                    },
                };
                break;
            }
            default:
                res.status(400).json({ message: 'Invalid report type' });
                return;
        }
        // Create new report
        const report = new report_model_1.Report({
            title,
            description,
            dateRange: {
                from: fromDate,
                to: toDate,
            },
            type,
            generatedBy,
            generatedAt: new Date(),
            data: reportData,
        });
        yield report.save();
        res.status(201).json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.generateReport = generateReport;
// // Get all reports
// export const getAllReports = async (req: Request, res: Response) => {
//   try {
//     const reports = await Report.find().sort({ generatedAt: -1 });
//     res.status(200).json(reports);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// Get all reports with pagination
const getAllReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Count total documents for pagination metadata
        const total = yield report_model_1.Report.countDocuments();
        // Get paginated reports
        const reports = yield report_model_1.Report.find()
            .sort({ generatedAt: -1 })
            .skip(skip)
            .limit(limit);
        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        res.status(200).json({
            reports,
            pagination: {
                totalReports: total,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage,
                hasPrevPage,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllReports = getAllReports;
// Get report by ID
const getReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid report ID' });
            return;
        }
        const report = yield report_model_1.Report.findById(id);
        if (!report) {
            res.status(404).json({ message: 'Report not found' });
            return;
        }
        res.status(200).json(report);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getReportById = getReportById;
