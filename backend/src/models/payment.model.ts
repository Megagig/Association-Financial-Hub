import { Schema, model } from 'mongoose';
import { IPaymentDocument, PaymentStatus } from '../types/payment.types';

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
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
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    receiptUrl: {
      type: String,
      match: /^https?:\/\//, // Simple URL validation
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// // Indexes
// PaymentSchema.index({ date: -1 }); // For sorting recent payments first
// PaymentSchema.index({ userId: 1, status: 1 }); // For common queries

export const Payment = model<IPaymentDocument>('Payment', PaymentSchema);
