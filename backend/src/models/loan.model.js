"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
const mongoose_1 = require("mongoose");
const loan_types_1 = require("../types/loan.types");
const LoanSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 1000, // Minimum loan amount
    },
    purpose: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    applicationDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: Object.values(loan_types_1.LoanStatus),
        default: loan_types_1.LoanStatus.PENDING,
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: function (v) {
                // Only required if status is APPROVED
                return this.status !== loan_types_1.LoanStatus.APPROVED || !!v;
            },
            message: 'Approver must be set for approved loans',
        },
    },
    approvalDate: {
        type: Date,
        validate: {
            validator: function (v) {
                return this.status !== loan_types_1.LoanStatus.APPROVED || !!v;
            },
            message: 'Approval date required for approved loans',
        },
    },
    repaymentTerms: {
        type: String,
        enum: ['3_months', '6_months', '12_months', '24_months'], // Match frontend values
        default: '12_months',
    },
    dueDate: {
        type: Date,
        validate: {
            validator: function (v) {
                return !v || v > new Date(); // Must be future date
            },
            message: 'Due date must be in the future',
        },
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        },
    },
});
// Indexes for common queries
LoanSchema.index({ status: 1 });
LoanSchema.index({ userId: 1, status: 1 });
exports.Loan = (0, mongoose_1.model)('Loan', LoanSchema);
