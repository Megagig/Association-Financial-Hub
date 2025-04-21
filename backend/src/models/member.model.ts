import { Schema, model, Types } from 'mongoose';
import mongoose from 'mongoose';
import { IMemberDocument } from '../types/member.types';
// Create member schema
const memberSchema = new mongoose.Schema(
  {
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
      unique: true, // Prevent duplicate emails
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email validation
    },
    phone: {
      type: String,
      validate: {
        validator: (v: string) => /^\+?[\d\s-]{10,}$/.test(v),
        message: 'Invalid phone number',
      },
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
      max: new Date(new Date().setFullYear(new Date().getFullYear() - 18)), // Ensure adult
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
      min: 0,
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

// Create and export the model
export const Member = mongoose.model<IMemberDocument>('Member', memberSchema);
