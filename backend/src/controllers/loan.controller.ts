import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import { Loan } from '../models/loan.model';
import { LoanStatus, RepaymentTerms } from '../types/loan.types';
import { Member } from '../models/member.model';

// Create a new loan application
export const applyForLoan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { amount, purpose, repaymentTerms } = req.body;
    const userId = req.userId; // Use authenticated user's ID for security

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

// Get all loans with pagination
export const getAllLoans = async (req: Request, res: Response) => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Parse filters if provided
    const filterOptions: any = {};

    // Add status filter if provided
    if (
      req.query.status &&
      Object.values(LoanStatus).includes(req.query.status as LoanStatus)
    ) {
      filterOptions.status = req.query.status;
    }

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
      filterOptions.applicationDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Count total documents for pagination info
    const totalLoans = await Loan.countDocuments(filterOptions);
    const totalPages = Math.ceil(totalLoans / limit);

    // Get loans with pagination
    const loans = await Loan.find(filterOptions)
      .sort({ applicationDate: -1 })
      .skip(skip)
      .limit(limit);

    // Return paginated results with metadata
    res.status(200).json({
      loans,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize: limit,
        totalItems: totalLoans,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
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

    // Check if user has permission to view this loan
    if (loan.userId.toString() !== req.userId) {
      // Check if user is admin or superadmin
      const user = await User.findById(req.userId);
      if (
        !user ||
        (user.role?.toString() !== 'admin' &&
          user.role?.toString() !== 'superadmin')
      ) {
        res.status(403).json({
          message: 'Access denied. You can only view your own loans.',
        });
        return;
      }
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
    const { status, repaymentTerms, dueDate } = req.body;

    // Validate repaymentTerms
    if (
      repaymentTerms &&
      !Object.values(RepaymentTerms).includes(repaymentTerms)
    ) {
      res.status(400).json({
        message: 'Invalid repayment terms',
        validTerms: Object.values(RepaymentTerms),
      });
      return;
    }

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

    // Check for valid status transitions
    const validTransitions: Record<LoanStatus, LoanStatus[]> = {
      [LoanStatus.PENDING]: [LoanStatus.APPROVED, LoanStatus.REJECTED],
      [LoanStatus.APPROVED]: [LoanStatus.PAID, LoanStatus.DEFAULTED],
      [LoanStatus.REJECTED]: [],
      [LoanStatus.PAID]: [],
      [LoanStatus.DEFAULTED]: [LoanStatus.PAID],
    };

    if (
      !validTransitions[loan.status].includes(status) &&
      loan.status !== status
    ) {
      res.status(400).json({
        message: `Invalid status transition from ${loan.status} to ${status}`,
        allowedTransitions: validTransitions[loan.status],
      });
      return;
    }

    // Update loan fields
    loan.status = status;

    if (status === LoanStatus.APPROVED) {
      loan.approvedBy = new mongoose.Types.ObjectId(req.userId); // Use the authenticated admin's ID
      loan.approvalDate = new Date();
      loan.repaymentTerms = repaymentTerms || loan.repaymentTerms;
      loan.dueDate = dueDate ? new Date(dueDate) : loan.dueDate;

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

// Get user's loan history with pagination
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

    // Check if user has permission to view this loan history
    if (userId !== req.userId) {
      // Check if user is admin or superadmin
      const user = await User.findById(req.userId);
      if (
        !user ||
        (user.role?.toString() !== 'admin' &&
          user.role?.toString() !== 'superadmin')
      ) {
        res.status(403).json({
          message: 'Access denied. You can only view your own loan history.',
        });
        return;
      }
    }

    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Parse filters if provided
    const filterOptions: any = { userId };

    // Add status filter if provided
    if (
      req.query.status &&
      Object.values(LoanStatus).includes(req.query.status as LoanStatus)
    ) {
      filterOptions.status = req.query.status;
    }

    // Add date range filter if provided
    if (req.query.startDate && req.query.endDate) {
      filterOptions.applicationDate = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    // Count total documents for pagination info
    const totalLoans = await Loan.countDocuments(filterOptions);
    const totalPages = Math.ceil(totalLoans / limit);

    // Get loans with pagination
    const loans = await Loan.find(filterOptions)
      .sort({ applicationDate: -1 })
      .skip(skip)
      .limit(limit);

    // Return paginated results with metadata
    res.status(200).json({
      loans,
      pagination: {
        currentPage: page,
        totalPages,
        pageSize: limit,
        totalItems: totalLoans,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
