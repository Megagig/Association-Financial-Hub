import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { Loan } from '../models/loan.model';
import { LoanStatus } from '../types/loan.types';
import { Member } from '../models/member.model';

// Create a new loan application
export const applyForLoan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, amount, purpose, repaymentTerms } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Calculate due date (default to 12 months from now)
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 12);

    // Create new loan application
    const loan = new Loan({
      userId,
      amount,
      purpose,
      applicationDate: new Date(),
      status: LoanStatus.PENDING,
      repaymentTerms: repaymentTerms || '12 months',
      dueDate,
    });

    await loan.save();

    // Update member's active loans count
    const member = await Member.findOne({ userId });
    if (member) {
      member.activeLoans += 1;
      await member.save();
    }

    res.status(201).json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all loans
export const getAllLoans = async (req: Request, res: Response) => {
  try {
    const loans = await Loan.find().sort({ applicationDate: -1 });
    res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get loan by ID
export const getLoanById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid loan ID' });
      return;
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      res.status(404).json({ message: 'Loan not found' });
      return;
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update loan status
export const updateLoanStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, approvedBy, approvalDate, repaymentTerms, dueDate } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid loan ID' });
      return;
    }

    if (!Object.values(LoanStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid loan status' });
      return;
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      res.status(404).json({ message: 'Loan not found' });
      return;
    }

    // Update loan fields
    loan.status = status;

    if (status === LoanStatus.APPROVED) {
      loan.approvedBy = approvedBy;
      loan.approvalDate = approvalDate || new Date();
      loan.repaymentTerms = repaymentTerms || loan.repaymentTerms;
      loan.dueDate = dueDate || loan.dueDate;

      // Update member's loan balance if loan is approved
      const member = await Member.findOne({ userId: loan.userId });
      if (member) {
        member.loanBalance += loan.amount;
        await member.save();
      }
    } else if (status === LoanStatus.PAID) {
      // Update member's loan balance and active loans count if loan is paid
      const member = await Member.findOne({ userId: loan.userId });
      if (member) {
        member.loanBalance = Math.max(0, member.loanBalance - loan.amount);
        member.activeLoans = Math.max(0, member.activeLoans - 1);
        await member.save();
      }
    } else if (status === LoanStatus.REJECTED) {
      // Update member's active loans count if loan is rejected
      const member = await Member.findOne({ userId: loan.userId });
      if (member) {
        member.activeLoans = Math.max(0, member.activeLoans - 1);
        await member.save();
      }
    }

    await loan.save();

    res.status(200).json(loan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's loan history
export const getUserLoanHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const loans = await Loan.find({ userId }).sort({ applicationDate: -1 });
    res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
