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
exports.getUserLoanHistory = exports.updateLoanStatus = exports.getLoanById = exports.getAllLoans = exports.applyForLoan = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const loan_model_1 = require("../models/loan.model");
const loan_types_1 = require("../types/loan.types");
const member_model_1 = require("../models/member.model");
// Create a new loan application
const applyForLoan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, purpose, repaymentTerms } = req.body;
        const userId = req.userId; // Use authenticated user's ID for security
        // Check if user exists
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Calculate due date (default to 12 months from now)
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + 12);
        // Create new loan application
        const loan = new loan_model_1.Loan({
            userId,
            amount,
            purpose,
            applicationDate: new Date(),
            status: loan_types_1.LoanStatus.PENDING,
            repaymentTerms: repaymentTerms || '12 months',
            dueDate,
        });
        yield loan.save();
        // Update member's active loans count
        const member = yield member_model_1.Member.findOne({ userId });
        if (member) {
            member.activeLoans += 1;
            yield member.save();
        }
        res.status(201).json(loan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.applyForLoan = applyForLoan;
// Get all loans with pagination
const getAllLoans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Parse filters if provided
        const filterOptions = {};
        // Add status filter if provided
        if (req.query.status &&
            Object.values(loan_types_1.LoanStatus).includes(req.query.status)) {
            filterOptions.status = req.query.status;
        }
        // Add date range filter if provided
        if (req.query.startDate && req.query.endDate) {
            filterOptions.applicationDate = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }
        // Count total documents for pagination info
        const totalLoans = yield loan_model_1.Loan.countDocuments(filterOptions);
        const totalPages = Math.ceil(totalLoans / limit);
        // Get loans with pagination
        const loans = yield loan_model_1.Loan.find(filterOptions)
            .sort({ applicationDate: -1 })
            .skip(skip)
            .limit(limit);
        // Return paginated results with metadata
        res.status(200).json({
            loans,
            pagination: {
                currentPage: page,
                totalPages,
                pageSize: limit,
                totalItems: totalLoans,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllLoans = getAllLoans;
// Get loan by ID
const getLoanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid loan ID' });
            return;
        }
        const loan = yield loan_model_1.Loan.findById(id);
        if (!loan) {
            res.status(404).json({ message: 'Loan not found' });
            return;
        }
        // Check if user has permission to view this loan
        if (loan.userId.toString() !== req.userId) {
            // Check if user is admin or superadmin
            const user = yield user_model_1.default.findById(req.userId);
            if (!user ||
                (((_a = user.role) === null || _a === void 0 ? void 0 : _a.toString()) !== 'admin' &&
                    ((_b = user.role) === null || _b === void 0 ? void 0 : _b.toString()) !== 'superadmin')) {
                res.status(403).json({
                    message: 'Access denied. You can only view your own loans.',
                });
                return;
            }
        }
        res.status(200).json(loan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getLoanById = getLoanById;
// Update loan status
const updateLoanStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, repaymentTerms, dueDate } = req.body;
        // Validate repaymentTerms
        if (repaymentTerms &&
            !Object.values(loan_types_1.RepaymentTerms).includes(repaymentTerms)) {
            res.status(400).json({
                message: 'Invalid repayment terms',
                validTerms: Object.values(loan_types_1.RepaymentTerms),
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid loan ID' });
            return;
        }
        if (!Object.values(loan_types_1.LoanStatus).includes(status)) {
            res.status(400).json({ message: 'Invalid loan status' });
            return;
        }
        const loan = yield loan_model_1.Loan.findById(id);
        if (!loan) {
            res.status(404).json({ message: 'Loan not found' });
            return;
        }
        // Check for valid status transitions
        const validTransitions = {
            [loan_types_1.LoanStatus.PENDING]: [loan_types_1.LoanStatus.APPROVED, loan_types_1.LoanStatus.REJECTED],
            [loan_types_1.LoanStatus.APPROVED]: [loan_types_1.LoanStatus.PAID, loan_types_1.LoanStatus.DEFAULTED],
            [loan_types_1.LoanStatus.REJECTED]: [],
            [loan_types_1.LoanStatus.PAID]: [],
            [loan_types_1.LoanStatus.DEFAULTED]: [loan_types_1.LoanStatus.PAID],
        };
        if (!validTransitions[loan.status].includes(status) &&
            loan.status !== status) {
            res.status(400).json({
                message: `Invalid status transition from ${loan.status} to ${status}`,
                allowedTransitions: validTransitions[loan.status],
            });
            return;
        }
        // Update loan fields
        loan.status = status;
        if (status === loan_types_1.LoanStatus.APPROVED) {
            loan.approvedBy = new mongoose_1.default.Types.ObjectId(req.userId); // Use the authenticated admin's ID
            loan.approvalDate = new Date();
            loan.repaymentTerms = repaymentTerms || loan.repaymentTerms;
            loan.dueDate = dueDate ? new Date(dueDate) : loan.dueDate;
            // Update member's loan balance if loan is approved
            const member = yield member_model_1.Member.findOne({ userId: loan.userId });
            if (member) {
                member.loanBalance += loan.amount;
                yield member.save();
            }
        }
        else if (status === loan_types_1.LoanStatus.PAID) {
            // Update member's loan balance and active loans count if loan is paid
            const member = yield member_model_1.Member.findOne({ userId: loan.userId });
            if (member) {
                member.loanBalance = Math.max(0, member.loanBalance - loan.amount);
                member.activeLoans = Math.max(0, member.activeLoans - 1);
                yield member.save();
            }
        }
        else if (status === loan_types_1.LoanStatus.REJECTED) {
            // Update member's active loans count if loan is rejected
            const member = yield member_model_1.Member.findOne({ userId: loan.userId });
            if (member) {
                member.activeLoans = Math.max(0, member.activeLoans - 1);
                yield member.save();
            }
        }
        yield loan.save();
        res.status(200).json(loan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateLoanStatus = updateLoanStatus;
// Get user's loan history with pagination
const getUserLoanHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        // Check if user has permission to view this loan history
        if (userId !== req.userId) {
            // Check if user is admin or superadmin
            const user = yield user_model_1.default.findById(req.userId);
            if (!user ||
                (((_a = user.role) === null || _a === void 0 ? void 0 : _a.toString()) !== 'admin' &&
                    ((_b = user.role) === null || _b === void 0 ? void 0 : _b.toString()) !== 'superadmin')) {
                res.status(403).json({
                    message: 'Access denied. You can only view your own loan history.',
                });
                return;
            }
        }
        // Parse pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // Parse filters if provided
        const filterOptions = { userId };
        // Add status filter if provided
        if (req.query.status &&
            Object.values(loan_types_1.LoanStatus).includes(req.query.status)) {
            filterOptions.status = req.query.status;
        }
        // Add date range filter if provided
        if (req.query.startDate && req.query.endDate) {
            filterOptions.applicationDate = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate),
            };
        }
        // Count total documents for pagination info
        const totalLoans = yield loan_model_1.Loan.countDocuments(filterOptions);
        const totalPages = Math.ceil(totalLoans / limit);
        // Get loans with pagination
        const loans = yield loan_model_1.Loan.find(filterOptions)
            .sort({ applicationDate: -1 })
            .skip(skip)
            .limit(limit);
        // Return paginated results with metadata
        res.status(200).json({
            loans,
            pagination: {
                currentPage: page,
                totalPages,
                pageSize: limit,
                totalItems: totalLoans,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserLoanHistory = getUserLoanHistory;
