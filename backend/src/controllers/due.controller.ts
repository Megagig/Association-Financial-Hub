import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { DueType } from '../types/due.types';
import { Due } from '../models/due.model';
import { Member } from '../models/member.model';
import User from '../models/user.model';
import { PaymentStatus } from '../models/payment.model';
import UserRole from '../types/user.types';

// Get all dues
export const getAllDues = async (req: Request, res: Response) => {
  try {
    const dues = await Due.find().sort({ dueDate: 1 });
    res.status(200).json(dues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get due by ID
export const getDueById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid due ID' });
      return;
    }

    const due = await Due.findById(id);

    if (!due) {
      res.status(404).json({ message: 'Due not found' });
      return;
    }

    res.status(200).json(due);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new due
export const createDue = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, title, description, amount, type, dueDate, issuedBy } =
      req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if issuer exists and is an admin
    const issuer = await User.findById(issuedBy);
    if (!issuer || issuer.role !== UserRole.ADMIN) {
      res.status(400).json({ message: 'Invalid issuer or not an admin' });
      return;
    }

    // Create new due
    const due = new Due({
      userId,
      title,
      description,
      amount,
      type,
      createdAt: new Date(),
      dueDate,
      status: PaymentStatus.PENDING,
      paidAmount: 0,
      issuedBy,
    });

    await due.save();

    // Update member's dues owing
    const member = await Member.findOne({ userId });
    if (member) {
      member.duesOwing += amount;
      await member.save();
    }

    res.status(201).json(due);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update due status
export const updateDueStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, paidAmount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid due ID' });
      return;
    }

    if (!Object.values(PaymentStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid due status' });
      return;
    }

    const due = await Due.findById(id);

    if (!due) {
      res.status(404).json({ message: 'Due not found' });
      return;
    }

    // If paid amount is provided, update it
    if (paidAmount !== undefined) {
      // Calculate new paid amount
      const newPaidAmount = due.paidAmount + paidAmount;

      // If fully paid, mark as approved
      if (newPaidAmount >= due.amount) {
        due.status = PaymentStatus.APPROVED;
        due.paidAmount = due.amount;
      } else {
        due.paidAmount = newPaidAmount;
      }

      // Update member's dues owing
      const member = await Member.findOne({ userId: due.userId });
      if (member) {
        member.duesOwing = Math.max(0, member.duesOwing - paidAmount);
        member.totalDuesPaid += paidAmount;
        await member.save();
      }
    } else {
      // Just update the status
      due.status = status;

      // If marking as approved (fully paid), ensure paid amount equals total amount
      if (
        status === PaymentStatus.APPROVED &&
        (due.paidAmount ?? 0) < due.amount
      ) {
        const remainingAmount = due.amount - (due.paidAmount ?? 0);
        due.paidAmount = due.amount;

        // Update member's dues owing
        const member = await Member.findOne({ userId: due.userId });
        if (member) {
          member.duesOwing = Math.max(0, member.duesOwing - remainingAmount);
          member.totalDuesPaid += remainingAmount;
          await member.save();
        }
      }
    }

    await due.save();

    res.status(200).json(due);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's dues
export const getUserDues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const dues = await Due.find({ userId }).sort({ dueDate: 1 });
    res.status(200).json(dues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
