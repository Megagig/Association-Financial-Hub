import { Types } from 'mongoose';

// Enum for loan status (shared across frontend/backend)
export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DEFAULTED = 'defaulted',
  PAID = 'paid',
}

// Base interface (database-agnostic)
export interface ILoan {
  userId: Types.ObjectId;
  amount: number;
  purpose: string;
  applicationDate: Date;
  status: LoanStatus;
  approvedBy?: Types.ObjectId; // Optional admin reference
  approvalDate?: Date;
  repaymentTerms?: string;
  dueDate?: Date;
}

// Extended for Mongoose documents
export interface ILoanDocument extends ILoan, Document {
  createdAt: Date; // From timestamps
  updatedAt: Date;
}

// DTO for creating loans (API input)
export type CreateLoanDto = Omit<ILoan, 'applicationDate' | 'status'> & {
  applicationDate?: string; // Allow ISO string
};

// DTO for API responses
export type LoanResponse = Omit<ILoan, 'userId' | 'approvedBy'> & {
  id: string;
  userId: string;
  approvedBy?: string;
  applicationDate: string;
  approvalDate?: string;
};
