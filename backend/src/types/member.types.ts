import { Document, Types } from 'mongoose';

// Base interface (without Mongoose-specific fields)
export interface IMember {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipId: string;
  occupation: string;
  memberSince: Date;
  dateOfBirth: Date;
  weddingAnniversary: Date;
  address: string;
  currentWorkplace?: string;
  currentPosition?: string;
  avatar?: string;
  totalDuesPaid: number;
  duesOwing: number;
  totalDonations: number;
  activeLoans: number;
  loanBalance: number;
}

export interface IMemberDocument extends IMember, Document {
  createdAt: Date;
  updatedAt: Date;
}
