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
exports.getUserPaymentHistory = exports.updatePaymentStatus = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const payment_model_1 = require("../models/payment.model");
const payment_types_1 = require("../types/payment.types");
const member_model_1 = require("../models/member.model");
// Create a new payment
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, amount, loanId, type, description, date, receiptUrl } = req.body;
        // Check if user exists
        const existingUser = yield user_model_1.default.findById(userId);
        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Create new payment
        const payment = new payment_model_1.Payment({
            userId,
            amount,
            loanId,
            type,
            description,
            date: date || new Date(),
            status: payment_types_1.PaymentStatus.PENDING, // Set as default
            receiptUrl,
        });
        yield payment.save();
        // If payment type is dues or donation, update member stats
        if (type === 'dues' || type === 'donation') {
            const member = yield member_model_1.Member.findOne({ userId });
            if (member) {
                if (type === 'donation') {
                    // Only update donations if payment is approved
                    if (payment.status === payment_types_1.PaymentStatus.APPROVED) {
                        member.totalDonations += amount;
                        yield member.save();
                    }
                }
                else if (type === 'dues') {
                    // For dues, we'll update duesOwing
                    member.duesOwing = Math.max(0, member.duesOwing - amount);
                    // Only update totalDuesPaid if payment is approved
                    if (payment.status === payment_types_1.PaymentStatus.APPROVED) {
                        member.totalDuesPaid += amount;
                    }
                    yield member.save();
                }
            }
        }
        res.status(201).json(payment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createPayment = createPayment;
// Get all payments
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield payment_model_1.Payment.find().sort({ date: -1 });
        res.status(200).json(payments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllPayments = getAllPayments;
// Get payment by ID
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid payment ID' });
            return;
        }
        const payment = yield payment_model_1.Payment.findById(id);
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        res.status(200).json(payment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getPaymentById = getPaymentById;
// Update payment status
const updatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid payment ID' });
            return;
        }
        if (!Object.values(payment_types_1.PaymentStatus).includes(status)) {
            res.status(400).json({ message: 'Invalid payment status' });
            return;
        }
        const payment = yield payment_model_1.Payment.findById(id);
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        // If we're changing from pending to approved, and it's a dues or donation payment,
        // update the member's stats
        if (payment.status !== payment_types_1.PaymentStatus.APPROVED &&
            status === payment_types_1.PaymentStatus.APPROVED) {
            const member = yield member_model_1.Member.findOne({ userId: payment.userId });
            if (member && (payment.type === 'dues' || payment.type === 'donation')) {
                if (payment.type === 'donation') {
                    member.totalDonations += payment.amount;
                }
                else if (payment.type === 'dues') {
                    member.totalDuesPaid += payment.amount;
                }
                yield member.save();
            }
        }
        // If we're changing from approved to rejected, and it's a dues or donation payment,
        // reverse the member's stats update
        if (payment.status === payment_types_1.PaymentStatus.APPROVED &&
            status === payment_types_1.PaymentStatus.REJECTED) {
            const member = yield member_model_1.Member.findOne({ userId: payment.userId });
            if (member && (payment.type === 'dues' || payment.type === 'donation')) {
                if (payment.type === 'donation') {
                    member.totalDonations = Math.max(0, member.totalDonations - payment.amount);
                }
                else if (payment.type === 'dues') {
                    member.totalDuesPaid = Math.max(0, member.totalDuesPaid - payment.amount);
                    member.duesOwing += payment.amount;
                }
                yield member.save();
            }
        }
        payment.status = status;
        yield payment.save();
        res.status(200).json(payment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
// Get user's payment history
const getUserPaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getUserPaymentHistory = getUserPaymentHistory;
