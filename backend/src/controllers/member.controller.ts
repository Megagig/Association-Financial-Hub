import { Request, Response, NextFunction } from 'express';
import { Member } from '../models/member.model';
import User from '../models/user.model';
import mongoose from 'mongoose';
import { Payment } from '../models/payment.model';
import { Loan } from '../models/loan.model';

// create a new member Profile
export async function createMember(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
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
      res.status(400).json({ message: 'Required fields missing' });
      return;
    }

    //check if user exist
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    //check if member already exists
    const existingMember = await Member.findOne({ userId });
    if (existingMember) {
      res.status(400).json({ message: 'Member already exists for this user' });
      return;
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
    // return the created member
    res.status(201).json({ message: 'Member created successfully', member });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating member' });
  }
}

// Get all members Profile with pagination
export const getAllMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Destructure query parameters (not req.body)
    const { page = 1, limit = 20 } = req.query;

    // Convert to numbers and validate
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      res.status(400).json({ message: 'Invalid pagination parameters' });
      return;
    }

    const members = await Member.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate('userId', 'name email')
      .lean(); // Convert to plain JS objects

    // Get total count for pagination metadata
    const totalMembers = await Member.countDocuments();

    res.status(200).json({
      success: true,
      data: members,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total: totalMembers,
        totalPages: Math.ceil(totalMembers / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error in getAllMembers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching members',
    });
  }
};

// get a single member Profile by member id
export const getMemberById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid member ID' });
      return;
    }

    const member = await Member.findById(id);

    if (!member) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching member' });
  }
};

// Get member Profile by user ID
export const getMemberByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid ID format',
      });
      return;
    }

    const member = await Member.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate('userId', 'name email');

    if (!member) {
      console.log(`No member found for userId: ${userId}`);
      // Check if user exists at all
      const userExists = await User.exists({
        _id: new mongoose.Types.ObjectId(userId),
      });

      res.status(404).json({
        success: false,
        message: userExists
          ? 'Member profile not found for this user'
          : 'User does not exist',
        userId: userId,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error(`Error in getMemberByUserId: ${error}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
// Update member Profile
export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      res.status(400).json({ message: 'Invalid member ID' });
      return;
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
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    res.status(200).json({
      message: 'Member updated successfully',
      data: updatedMember,
    });
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

// Get member loans
export const getMemberLoans = async (
  req: Request,
  res: Response,
  next: NextFunction
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
