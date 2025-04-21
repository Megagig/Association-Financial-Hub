import { Types } from 'mongoose';

// Enum for loan status (shared across frontend/backend)
export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DEFAULTED = 'defaulted',
  PAID = 'paid',
}

export enum RepaymentTerms {
  THREE_MONTHS = '3_months',
  SIX_MONTHS = '6_months',
  TWELVE_MONTHS = '12_months',
  TWENTY_FOUR_MONTHS = '24_months',
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
  repaymentTerms?: RepaymentTerms;
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
