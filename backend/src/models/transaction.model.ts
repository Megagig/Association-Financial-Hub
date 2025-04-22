import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../types/transaction.types';

export interface TransactionDocument
  extends Omit<ITransaction, 'id'>,
    Document {}

const TransactionSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Dues', 'Donation', 'Event', 'Administrative', 'Other'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance optimization
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ type: 1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ description: 'text' });

export default mongoose.model<TransactionDocument>(
  'Transaction',
  TransactionSchema
);
