import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { Payment } from '../models/payment.model';
import { PaymentStatus } from '../types/payment.types';
import { Member } from '../models/member.model';

// Create a new payment
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, amount, loanId, type, description, date, receiptUrl } =
      req.body;

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Create new payment
    const payment = new Payment({
      userId,
      amount,
      loanId,
      type,
      description,
      date: date || new Date(),
      status: PaymentStatus.PENDING, // Set as default
      receiptUrl,
    });

    await payment.save();

    // If payment type is dues or donation, update member stats
    if (type === 'dues' || type === 'donation') {
      const member = await Member.findOne({ userId });

      if (member) {
        if (type === 'donation') {
          // Only update donations if payment is approved
          if (payment.status === PaymentStatus.APPROVED) {
            member.totalDonations += amount;
            await member.save();
          }
        } else if (type === 'dues') {
          // For dues, we'll update duesOwing
          member.duesOwing = Math.max(0, member.duesOwing - amount);

          // Only update totalDuesPaid if payment is approved
          if (payment.status === PaymentStatus.APPROVED) {
            member.totalDuesPaid += amount;
          }

          await member.save();
        }
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment by ID
export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid payment ID' });
      return;
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update payment status
export const updatePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid payment ID' });
      return;
    }

    if (!Object.values(PaymentStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid payment status' });
      return;
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    // If we're changing from pending to approved, and it's a dues or donation payment,
    // update the member's stats
    if (
      payment.status !== PaymentStatus.APPROVED &&
      status === PaymentStatus.APPROVED
    ) {
      const member = await Member.findOne({ userId: payment.userId });

      if (member && (payment.type === 'dues' || payment.type === 'donation')) {
        if (payment.type === 'donation') {
          member.totalDonations += payment.amount;
        } else if (payment.type === 'dues') {
          member.totalDuesPaid += payment.amount;
        }

        await member.save();
      }
    }

    // If we're changing from approved to rejected, and it's a dues or donation payment,
    // reverse the member's stats update
    if (
      payment.status === PaymentStatus.APPROVED &&
      status === PaymentStatus.REJECTED
    ) {
      const member = await Member.findOne({ userId: payment.userId });

      if (member && (payment.type === 'dues' || payment.type === 'donation')) {
        if (payment.type === 'donation') {
          member.totalDonations = Math.max(
            0,
            member.totalDonations - payment.amount
          );
        } else if (payment.type === 'dues') {
          member.totalDuesPaid = Math.max(
            0,
            member.totalDuesPaid - payment.amount
          );
          member.duesOwing += payment.amount;
        }

        await member.save();
      }
    }

    payment.status = status;
    await payment.save();

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's payment history
export const getUserPaymentHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const payments = await Payment.find({ userId }).sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
