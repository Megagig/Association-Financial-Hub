import { Types } from 'mongoose';

// Enum for payment status (shared across frontend/backend)
export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Base interface (pure TypeScript)
export interface IPayment {
  userId: Types.ObjectId;
  amount: number;
  type: 'dues' | 'levy' | 'pledge' | 'donation';
  description: string;
  date: Date;
  status: PaymentStatus;
  receiptUrl?: string;
}

// Extended for Mongoose documents
export interface IPaymentDocument extends IPayment, Document {
  createdAt: Date;
  updatedAt: Date;
}

// DTO for creating payments (API input)
export type CreatePaymentDto = Omit<IPayment, 'date' | 'status'> & {
  date?: string; // Allow ISO string input
};

// DTO for API responses
export type PaymentResponse = Omit<IPayment, 'userId'> & {
  id: string;
  userId: string;
  date: string;
  createdAt: string;
};
