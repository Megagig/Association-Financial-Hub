import { Schema, model, Types } from 'mongoose';
import { ILoanDocument, LoanStatus } from '../types/loan.types';

const LoanSchema = new Schema<ILoanDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
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
      enum: Object.values(LoanStatus),
      default: LoanStatus.PENDING,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      validate: {
        validator: function (this: ILoanDocument, v?: Types.ObjectId) {
          // Only required if status is APPROVED
          return this.status !== LoanStatus.APPROVED || !!v;
        },
        message: 'Approver must be set for approved loans',
      },
    },
    approvalDate: {
      type: Date,
      validate: {
        validator: function (this: ILoanDocument, v?: Date) {
          return this.status !== LoanStatus.APPROVED || !!v;
        },
        message: 'Approval date required for approved loans',
      },
    },
    repaymentTerms: {
      type: String,
      enum: ['30_days', '60_days', '90_days'],
      default: '30_days',
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (v?: Date) {
          return !v || v > new Date(); // Must be future date
        },
        message: 'Due date must be in the future',
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Indexes for common queries
LoanSchema.index({ status: 1 });
LoanSchema.index({ userId: 1, status: 1 });

export const Loan = model<ILoanDocument>('Loan', LoanSchema);
