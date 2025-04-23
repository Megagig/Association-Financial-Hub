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
exports.getFinancialSummary = exports.getMemberLoans = exports.getMemberPayments = exports.updateMember = exports.getMemberByUserId = exports.getMemberById = exports.getAllMembers = void 0;
exports.createMember = createMember;
const member_model_1 = require("../models/member.model");
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const payment_model_1 = require("../models/payment.model");
const loan_model_1 = require("../models/loan.model");
// create a new member Profile
function createMember(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, firstName, lastName, email, phone, membershipId, occupation, memberSince, dateOfBirth, weddingAnniversary, currentWorkplace, currentPosition, address, avatar, totalDuesPaid, duesOwing, totalDonations, activeLoans, loanBalance, } = req.body;
            // Basic validation
            if (!userId || !firstName || !lastName || !email) {
                res.status(400).json({ message: 'Required fields missing' });
                return;
            }
            //check if user exist
            const existingUser = yield user_model_1.default.findById(userId);
            if (!existingUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            //check if member already exists
            const existingMember = yield member_model_1.Member.findOne({ userId });
            if (existingMember) {
                res.status(400).json({ message: 'Member already exists for this user' });
                return;
            }
            // Create a new member
            const member = new member_model_1.Member({
                userId,
                firstName,
                lastName,
                email,
                phone,
                membershipId,
                occupation,
                memberSince,
                dateOfBirth,
                weddingAnniversary,
                currentWorkplace,
                currentPosition,
                address,
                avatar,
                totalDuesPaid,
                duesOwing,
                totalDonations,
                activeLoans,
                loanBalance,
            });
            yield member.save();
            // return the created member
            res.status(201).json({ message: 'Member created successfully', member });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating member' });
        }
    });
}
// Get all members Profile with pagination
const getAllMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure query parameters (not req.body)
        const { page = 1, limit = 20 } = req.query;
        // Convert to numbers and validate
        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        if (isNaN(pageNumber) || isNaN(limitNumber)) {
            res.status(400).json({ message: 'Invalid pagination parameters' });
            return;
        }
        const members = yield member_model_1.Member.find()
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate('userId', 'name email')
            .lean(); // Convert to plain JS objects
        // Get total count for pagination metadata
        const totalMembers = yield member_model_1.Member.countDocuments();
        res.status(200).json({
            success: true,
            data: members,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total: totalMembers,
                totalPages: Math.ceil(totalMembers / limitNumber),
            },
        });
    }
    catch (error) {
        console.error('Error in getAllMembers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching members',
        });
    }
});
exports.getAllMembers = getAllMembers;
// get a single member Profile by member id
const getMemberById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid member ID' });
            return;
        }
        const member = yield member_model_1.Member.findById(id);
        if (!member) {
            res.status(404).json({ message: 'Member not found' });
            return;
        }
        res.status(200).json(member);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching member' });
    }
});
exports.getMemberById = getMemberById;
// Get member Profile by user ID
const getMemberByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({
                success: false,
                message: 'Invalid ID format',
            });
            return;
        }
        const member = yield member_model_1.Member.findOne({
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }).populate('userId', 'name email');
        if (!member) {
            console.log(`No member found for userId: ${userId}`);
            // Check if user exists at all
            const userExists = yield user_model_1.default.exists({
                _id: new mongoose_1.default.Types.ObjectId(userId),
            });
            res.status(404).json({
                success: false,
                message: userExists
                    ? 'Member profile not found for this user'
                    : 'User does not exist',
                userId: userId,
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: member,
        });
    }
    catch (error) {
        console.error(`Error in getMemberByUserId: ${error}`);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.getMemberByUserId = getMemberByUserId;
// Update member Profile
const updateMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId, firstName, lastName, email, phone, membershipId, occupation, memberSince, dateOfBirth, weddingAnniversary, currentWorkplace, currentPosition, address, avatar, totalDuesPaid, duesOwing, totalDonations, activeLoans, loanBalance, } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid member ID' });
            return;
        }
        const updatedMember = yield member_model_1.Member.findByIdAndUpdate(id, {
            userId,
            firstName,
            lastName,
            email,
            phone,
            membershipId,
            occupation,
            memberSince,
            dateOfBirth,
            weddingAnniversary,
            currentWorkplace,
            currentPosition,
            address,
            avatar,
            totalDuesPaid,
            duesOwing,
            totalDonations,
            activeLoans,
            loanBalance,
        }, { new: true });
        if (!updatedMember) {
            res.status(404).json({ message: 'Member not found' });
            return;
        }
        res.status(200).json({
            message: 'Member updated successfully',
            data: updatedMember,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateMember = updateMember;
// Get member payments
const getMemberPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const payments = yield payment_model_1.Payment.find({ userId }).sort({ date: -1 });
        res.status(200).json(payments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getMemberPayments = getMemberPayments;
// Get member loans
const getMemberLoans = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
            return;
        }
        const loans = yield loan_model_1.Loan.find({ userId }).sort({ applicationDate: -1 });
        res.status(200).json(loans);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
exports.getMemberLoans = getMemberLoans;
// Get financial summary for all members (admin only)
const getFinancialSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Execute all aggregations in parallel for better performance
        const [totalMembers, paymentsAggregation, loansAggregation, membersAggregation, repaidLoansAggregation,] = yield Promise.all([
            member_model_1.Member.countDocuments(),
            payment_model_1.Payment.aggregate([
                {
                    $group: {
                        _id: '$type',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
            ]),
            loan_model_1.Loan.aggregate([
                {
                    $group: {
                        _id: '$status',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
            ]),
            member_model_1.Member.aggregate([
                { $group: { _id: null, totalDuesPending: { $sum: '$duesOwing' } } },
            ]),
            // Calculate actual repaid loans from payment records
            payment_model_1.Payment.aggregate([
                { $match: { loanId: { $exists: true } } },
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
        ]);
        // Helper function to safely extract aggregation results
        const getAggregationValue = (arr, id) => { var _a; return ((_a = arr.find((item) => item._id === id)) === null || _a === void 0 ? void 0 : _a.total) || 0; };
        const financialSummary = {
            totalMembers,
            totalDuesCollected: getAggregationValue(paymentsAggregation, 'dues'),
            totalDuesPending: ((_a = membersAggregation[0]) === null || _a === void 0 ? void 0 : _a.totalDuesPending) || 0,
            totalDonations: getAggregationValue(paymentsAggregation, 'donation'),
            totalPledges: getAggregationValue(paymentsAggregation, 'pledge'),
            totalLoansDisbursed: getAggregationValue(loansAggregation, 'approved'),
            totalLoansRepaid: ((_b = repaidLoansAggregation[0]) === null || _b === void 0 ? void 0 : _b.total) || 0, // Actual repaid amount
            pendingLoanApplications: ((_c = loansAggregation.find((item) => item._id === 'pending')) === null || _c === void 0 ? void 0 : _c.count) || 0,
            timestamp: new Date().toISOString(),
        };
        res.status(200).json(financialSummary);
    }
    catch (error) {
        console.error('Financial summary error:', error);
        res.status(500).json({
            message: 'Failed to generate financial summary',
            error: process.env.NODE_ENV === 'development' && error instanceof Error
                ? error.message
                : undefined,
        });
    }
});
exports.getFinancialSummary = getFinancialSummary;
