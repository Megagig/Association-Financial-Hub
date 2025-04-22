import mongoose, { Types } from 'mongoose';
import { PaymentStatus } from './payment.types'; // this exists in the payment.types.ts file

// Enum for due types (shared across frontend/backend)
export enum DueType {
  ANNUAL = 'annual',
  CONDOLENCE = 'condolence',
  WEDDING = 'wedding',
  OTHER = 'other',
}

// Base interface (database-agnostic)
// export interface IDue {
//   userId: Types.ObjectId;
//   title: string;
//   description: string;
//   amount: number;
//   type: DueType;
//   createdAt: Date;
//   dueDate: Date;
//   status: PaymentStatus;
//   paidAmount?: number;
//   issuedBy: Types.ObjectId;
// }
export interface IDue {
  userId: Types.ObjectId;
  title: string;
  description: string;
  amount: number;
  type: DueType;
  createdAt: Date;
  dueDate: Date;
  status: PaymentStatus;
  paidAmount?: number;
  issuedBy: Types.ObjectId;
  isDeleted?: boolean;
  deletedAt?: Date | null;
  deletedBy?: Types.ObjectId | null;
  deletionReason?: string | null;
  restoredAt?: Date; // Added restoredAt field
  restoredBy?: mongoose.Types.ObjectId; // Added restoredBy field
}
// Extended for Mongoose documents
export interface IDueDocument extends IDue, Document {
  updatedAt: Date; // Added by timestamps
}

// DTO for creating dues (API input)
export type CreateDueDto = Omit<IDue, 'createdAt' | 'status' | 'paidAmount'> & {
  dueDate: string; // ISO string
};

// DTO for API responses
export type DueResponse = Omit<IDue, 'userId' | 'issuedBy'> & {
  id: string;
  userId: string;
  issuedBy: string;
  createdAt: string;
  dueDate: string;
};

export { PaymentStatus };
