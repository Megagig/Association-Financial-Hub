import mongoose from 'mongoose';
import { IMemberDocument } from '../types/member.types';
// Create member schema
const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  membershipId: {
    type: String,
    required: true,
    unique: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  memberSince: {
    type: Date,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  weddingAnniversary: {
    type: Date,
  },
  address: {
    type: String,
    required: true,
  },
  currentWorkplace: {
    type: String,
  },
  currentPosition: {
    type: String,
  },
  avatar: {
    type: String,
  },
  totalDuesPaid: {
    type: Number,
    default: 0,
  },
  duesOwing: {
    type: Number,
    default: 0,
  },
  totalDonations: {
    type: Number,
    default: 0,
  },
  activeLoans: {
    type: Number,
    default: 0,
  },
  loanBalance: {
    type: Number,
    default: 0,
  },
});
// Create and export the model
const Member = mongoose.model<IMemberDocument>('Member', memberSchema);
export default Member;
