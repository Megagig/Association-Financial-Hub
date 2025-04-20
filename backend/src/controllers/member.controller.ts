import { Request, Response } from 'express';
import { Member } from '../models/member.model';
import User from '../models/user.model';
import mongoose from 'mongoose';
import { Payment } from '../models/payment.model';
import { Loan } from '../models/loan.model';

// create a new member
export async function createMember(req: Request, res: Response) {
  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      membershipId,
      occupation,
      memberSince,
      dateOfBirth,
      weddingAnniversary,
      currentWorkplace,
      currentPosition,
      address,
      avatar,
      totalDuesPaid,
      duesOwing,
      totalDonations,
      activeLoans,
      loanBalance,
    } = req.body;

    // Basic validation
    if (!userId || !firstName || !lastName || !email) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    //check if user exist
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    //check if member already exists
    const existingMember = await Member.findOne({ userId });
    if (existingMember) {
      return res
        .status(400)
        .json({ message: 'Member already exists for this user' });
    }

    // Create a new member
    const member = new Member({
      userId,
      firstName,
      lastName,
      email,
      phone,
      membershipId,
      occupation,
      memberSince,
      dateOfBirth,
      weddingAnniversary,
      currentWorkplace,
      currentPosition,
      address,
      avatar,
      totalDuesPaid,
      duesOwing,
      totalDonations,
      activeLoans,
      loanBalance,
    });

    await member.save();
    // reurn the created member
    res.status(201).json({ message: 'Member created successfully', member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating member' });
  }
}

// get all members
export const getAllMembers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const members = await Member.find()
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('userId', 'name email');

    res.status(200).json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching members' });
  }
};

// get a single member by id
export const getMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching member' });
  }
};

// Get member by user ID
export const getMemberByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const member = await Member.findOne({ userId });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Update member
export const updateMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      membershipId,
      occupation,
      memberSince,
      dateOfBirth,
      weddingAnniversary,
      currentWorkplace,
      currentPosition,
      address,
      avatar,
      totalDuesPaid,
      duesOwing,
      totalDonations,
      activeLoans,
      loanBalance,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid member ID' });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      {
        userId,
        firstName,
        lastName,
        email,
        phone,
        membershipId,
        occupation,
        memberSince,
        dateOfBirth,
        weddingAnniversary,
        currentWorkplace,
        currentPosition,
        address,
        avatar,
        totalDuesPaid,
        duesOwing,
        totalDonations,
        activeLoans,
        loanBalance,
      },
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get member payments
export const getMemberPayments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const payments = await Payment.find({ userId }).sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get member loans
export const getMemberLoans = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const loans = await Loan.find({ userId }).sort({ applicationDate: -1 });
    res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get financial summary for all members (admin only)

export const getFinancialSummary = async (req: Request, res: Response) => {
  try {
    // Execute all aggregations in parallel for better performance
    const [
      totalMembers,
      paymentsAggregation,
      loansAggregation,
      membersAggregation,
      repaidLoansAggregation,
    ] = await Promise.all([
      Member.countDocuments(),
      Payment.aggregate([
        {
          $group: {
            _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Loan.aggregate([
        {
          $group: {
            _id: '$status',
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
      ]),
      Member.aggregate([
        { $group: { _id: null, totalDuesPending: { $sum: '$duesOwing' } } },
      ]),
      // Calculate actual repaid loans from payment records
      Payment.aggregate([
        { $match: { loanId: { $exists: true } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    // Helper function to safely extract aggregation results
    const getAggregationValue = (arr: any[], id: string) =>
      arr.find((item) => item._id === id)?.total || 0;

    const financialSummary = {
      totalMembers,
      totalDuesCollected: getAggregationValue(paymentsAggregation, 'dues'),
      totalDuesPending: membersAggregation[0]?.totalDuesPending || 0,
      totalDonations: getAggregationValue(paymentsAggregation, 'donation'),
      totalPledges: getAggregationValue(paymentsAggregation, 'pledge'),
      totalLoansDisbursed: getAggregationValue(loansAggregation, 'approved'),
      totalLoansRepaid: repaidLoansAggregation[0]?.total || 0, // Actual repaid amount
      pendingLoanApplications:
        loansAggregation.find((item) => item._id === 'pending')?.count || 0,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(financialSummary);
  } catch (error) {
    console.error('Financial summary error:', error);
    res.status(500).json({
      message: 'Failed to generate financial summary',
      error:
        process.env.NODE_ENV === 'development' && error instanceof Error
          ? error.message
          : undefined,
    });
  }
};
