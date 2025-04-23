"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_types_1 = require("../types/payment.types");
Object.defineProperty(exports, "PaymentStatus", { enumerable: true, get: function () { return payment_types_1.PaymentStatus; } });
const PaymentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // Added for better query performance
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01, // Validation
    },
    loanId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Loan',
        required: false,
    },
    type: {
        type: String,
        enum: ['dues', 'donation', 'pledge', 'levy'],
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: Object.values(payment_types_1.PaymentStatus),
        default: payment_types_1.PaymentStatus.PENDING,
    },
    receiptUrl: {
        type: String,
        match: /^https?:\/\//, // Simple URL validation
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        },
    },
});
// // Indexes
// PaymentSchema.index({ date: -1 }); // For sorting recent payments first
// PaymentSchema.index({ userId: 1, status: 1 }); // For common queries
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
