import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { DueType } from '../types/due.types';
import { UserRole } from '../types/user.types';
import { Due } from '../models/due.model';
import { Member } from '../models/member.model';
import User from '../models/user.model';
import { PaymentStatus } from '../models/payment.model';

// / Create a new due
// export const createDue = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { userId, title, description, amount, type, dueDate, issuedBy } =
//       req.body;

//     // Basic validation
//     if (!userId || !title || !amount || !type || !dueDate || !issuedBy) {
//       res.status(400).json({ message: 'Required fields missing' });
//       return;
//     }

//     // Validate due type
//     if (!Object.values(DueType).includes(type)) {
//       res.status(400).json({
//         message: 'Invalid due type',
//         validTypes: Object.values(DueType),
//       });
//       return;
//     }

//     // Check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       res.status(404).json({ message: 'User not found' });
//       return;
//     }

//     // Check if issuer exists and has proper permissions
//     const issuer = await User.findById(issuedBy);
//     if (
//       !issuer ||
//       (issuer.role?.toString() !== UserRole.ADMIN &&
//         issuer.role?.toString() !== UserRole.SUPERADMIN)
//     ) {
//       res.status(403).json({
//         message: 'Not authorized to create dues',
//         required: [UserRole.ADMIN, UserRole.SUPERADMIN],
//         received: issuer?.role,
//       });
//       return;
//     }

//     // Create new due
//     const due = new Due({
//       userId,
//       title,
//       description,
//       amount,
//       type,
//       createdAt: new Date(),
//       dueDate: new Date(dueDate),
//       status: PaymentStatus.PENDING,
//       paidAmount: 0,
//       issuedBy,
//     });

//     // Validate the due date
//     if (due.dueDate <= new Date()) {
//       res.status(400).json({ message: 'Due date must be in the future' });
//       return;
//     }

//     await due.save();

//     // Update member's dues owing
//     const member = await Member.findOne({ userId });
//     if (member) {
//       member.duesOwing = (member.duesOwing || 0) + amount;
//       await member.save();
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Due created successfully',
//       data: due,
//     });
//   } catch (error) {
//     console.error('Error creating due:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating due',
//     });
//   }
// };

// Create a new due with transaction
export const createDue = async (req: Request, res: Response): Promise<void> => {
  // Start a new session
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    const { userId, title, description, amount, type, dueDate, issuedBy } =
      req.body;

    // Basic validation
    if (!userId || !title || !amount || !type || !dueDate || !issuedBy) {
      res.status(400).json({ message: 'Required fields missing' });
      return;
    }

    // Validate due type
    if (!Object.values(DueType).includes(type)) {
      res.status(400).json({
        message: 'Invalid due type',
        validTypes: Object.values(DueType),
      });
      return;
    }

    // Check if user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      await session.abortTransaction();
      return;
    }

    // Check if issuer exists and has proper permissions
    const issuer = await User.findById(issuedBy).session(session);
    if (
      !issuer ||
      (issuer.role?.toString() !== UserRole.ADMIN &&
        issuer.role?.toString() !== UserRole.SUPERADMIN)
    ) {
      res.status(403).json({
        message: 'Not authorized to create dues',
        required: [UserRole.ADMIN, UserRole.SUPERADMIN],
        received: issuer?.role,
      });
      await session.abortTransaction();
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
      dueDate: new Date(dueDate),
      status: PaymentStatus.PENDING,
      paidAmount: 0,
      issuedBy,
    });

    // Validate the due date
    if (due.dueDate <= new Date()) {
      res.status(400).json({ message: 'Due date must be in the future' });
      await session.abortTransaction();
      return;
    }

    await due.save({ session });

    // Update member's dues owing
    const member = await Member.findOne({ userId }).session(session);
    if (member) {
      member.duesOwing = (member.duesOwing || 0) + amount;
      await member.save({ session });
    }

    // Commit the transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Due created successfully',
      data: due,
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Error creating due:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating due',
    });
  } finally {
    // End session
    session.endSession();
  }
};

// Update due status with transaction
export const updateDueStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Start a new session
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    const { id } = req.params;
    const { status, paidAmount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid due ID' });
      await session.abortTransaction();
      return;
    }

    if (status && !Object.values(PaymentStatus).includes(status)) {
      res.status(400).json({ message: 'Invalid due status' });
      await session.abortTransaction();
      return;
    }

    const due = await Due.findById(id).session(session);

    if (!due) {
      res.status(404).json({ message: 'Due not found' });
      await session.abortTransaction();
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
      const member = await Member.findOne({ userId: due.userId }).session(
        session
      );
      if (member) {
        member.duesOwing = Math.max(0, member.duesOwing - paidAmount);
        member.totalDuesPaid += paidAmount;
        await member.save({ session });
      }
    } else if (status) {
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
        const member = await Member.findOne({ userId: due.userId }).session(
          session
        );
        if (member) {
          member.duesOwing = Math.max(0, member.duesOwing - remainingAmount);
          member.totalDuesPaid += remainingAmount;
          await member.save({ session });
        }
      }
    }

    await due.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json(due);
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    // End session
    session.endSession();
  }
};

// // Get all dues
// export const getAllDues = async (req: Request, res: Response) => {
//   try {
//     const dues = await Due.find().sort({ dueDate: 1 });
//     res.status(200).json(dues);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Get all dues with pagination
export const getAllDues = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalDues = await Due.countDocuments();
    const totalPages = Math.ceil(totalDues / limit);

    const dues = await Due.find().sort({ dueDate: 1 }).skip(skip).limit(limit);

    res.status(200).json({
      dues,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalDues,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's dues with pagination
export const getUserDues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const totalDues = await Due.countDocuments({ userId });
    const totalPages = Math.ceil(totalDues / limit);

    const dues = await Due.find({ userId })
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      dues,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalDues,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
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

// // Update due status
// export const updateDueStatus = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { id } = req.params;
//     const { status, paidAmount } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       res.status(400).json({ message: 'Invalid due ID' });
//       return;
//     }

//     if (!Object.values(PaymentStatus).includes(status)) {
//       res.status(400).json({ message: 'Invalid due status' });
//       return;
//     }

//     const due = await Due.findById(id);

//     if (!due) {
//       res.status(404).json({ message: 'Due not found' });
//       return;
//     }

//     // If paid amount is provided, update it
//     if (paidAmount !== undefined) {
//       // Calculate new paid amount
//       const newPaidAmount = due.paidAmount + paidAmount;

//       // If fully paid, mark as approved
//       if (newPaidAmount >= due.amount) {
//         due.status = PaymentStatus.APPROVED;
//         due.paidAmount = due.amount;
//       } else {
//         due.paidAmount = newPaidAmount;
//       }

//       // Update member's dues owing
//       const member = await Member.findOne({ userId: due.userId });
//       if (member) {
//         member.duesOwing = Math.max(0, member.duesOwing - paidAmount);
//         member.totalDuesPaid += paidAmount;
//         await member.save();
//       }
//     } else {
//       // Just update the status
//       due.status = status;

//       // If marking as approved (fully paid), ensure paid amount equals total amount
//       if (
//         status === PaymentStatus.APPROVED &&
//         (due.paidAmount ?? 0) < due.amount
//       ) {
//         const remainingAmount = due.amount - (due.paidAmount ?? 0);
//         due.paidAmount = due.amount;

//         // Update member's dues owing
//         const member = await Member.findOne({ userId: due.userId });
//         if (member) {
//           member.duesOwing = Math.max(0, member.duesOwing - remainingAmount);
//           member.totalDuesPaid += remainingAmount;
//           await member.save();
//         }
//       }
//     }

//     await due.save();

//     res.status(200).json(due);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get user's dues
// export const getUserDues = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       res.status(400).json({ message: 'Invalid user ID' });
//       return;
//     }

//     const dues = await Due.find({ userId }).sort({ dueDate: 1 });
//     res.status(200).json(dues);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// Bulk create dues
export const bulkCreateDues = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Start a new session
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    const { dues } = req.body;

    if (!Array.isArray(dues) || dues.length === 0) {
      res.status(400).json({ message: 'Invalid or empty dues array' });
      return;
    }

    const createdDues = [];
    const errors = [];
    const memberUpdates = new Map<string, number>();

    // Validate all dues first
    for (let i = 0; i < dues.length; i++) {
      const dueData = dues[i];
      const { userId, title, description, amount, type, dueDate, issuedBy } =
        dueData;

      // Basic validation
      if (!userId || !title || !amount || !type || !dueDate || !issuedBy) {
        errors.push({ index: i, message: 'Required fields missing' });
        continue;
      }

      // Validate due type
      if (!Object.values(DueType).includes(type)) {
        errors.push({
          index: i,
          message: 'Invalid due type',
          validTypes: Object.values(DueType),
        });
        continue;
      }

      // Check if user exists
      const user = await User.findById(userId).session(session);
      if (!user) {
        errors.push({ index: i, message: 'User not found' });
        continue;
      }

      // Check if issuer exists and has proper permissions
      const issuer = await User.findById(issuedBy).session(session);
      if (
        !issuer ||
        (issuer.role?.toString() !== UserRole.ADMIN &&
          issuer.role?.toString() !== UserRole.SUPERADMIN)
      ) {
        errors.push({
          index: i,
          message: 'Not authorized to create dues',
          required: [UserRole.ADMIN, UserRole.SUPERADMIN],
          received: issuer?.role,
        });
        continue;
      }

      // Create due object
      const due = new Due({
        userId,
        title,
        description,
        amount,
        type,
        createdAt: new Date(),
        dueDate: new Date(dueDate),
        status: PaymentStatus.PENDING,
        paidAmount: 0,
        issuedBy,
      });

      // Validate the due date
      if (due.dueDate <= new Date()) {
        errors.push({ index: i, message: 'Due date must be in the future' });
        continue;
      }

      // Track member updates
      if (memberUpdates.has(userId.toString())) {
        memberUpdates.set(
          userId.toString(),
          memberUpdates.get(userId.toString())! + amount
        );
      } else {
        memberUpdates.set(userId.toString(), amount);
      }

      await due.save({ session });
      createdDues.push(due);
    }

    // If there are any errors, abort
    if (errors.length > 0) {
      await session.abortTransaction();
      res.status(400).json({
        success: false,
        message: 'Validation errors in bulk creation',
        errors,
      });
      return;
    }

    // Update all members
    for (const [userId, amountToAdd] of memberUpdates.entries()) {
      const member = await Member.findOne({ userId }).session(session);
      if (member) {
        member.duesOwing = (member.duesOwing || 0) + amountToAdd;
        await member.save({ session });
      }
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: `Successfully created ${createdDues.length} dues`,
      data: createdDues,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk creating dues:', error);
    res.status(500).json({
      success: false,
      message: 'Error in bulk creating dues',
    });
  } finally {
    session.endSession();
  }
};

// Bulk update due statuses
export const bulkUpdateDueStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Start a new session
  const session = await mongoose.startSession();

  try {
    // Start transaction
    session.startTransaction();

    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      res.status(400).json({ message: 'Invalid or empty updates array' });
      return;
    }

    const updatedDues = [];
    const errors = [];
    const memberUpdates = new Map<string, number>();

    // Process all updates
    for (let i = 0; i < updates.length; i++) {
      const update = updates[i];
      const { dueId, status, paidAmount } = update;

      if (!mongoose.Types.ObjectId.isValid(dueId)) {
        errors.push({ index: i, message: 'Invalid due ID' });
        continue;
      }

      if (status && !Object.values(PaymentStatus).includes(status)) {
        errors.push({
          index: i,
          message: 'Invalid due status',
          validValues: Object.values(PaymentStatus),
        });
        continue;
      }

      const due = await Due.findById(dueId).session(session);

      if (!due) {
        errors.push({ index: i, message: 'Due not found' });
        continue;
      }

      let paymentToRecord = 0;

      // If paid amount is provided, update it
      if (paidAmount !== undefined) {
        // Calculate new paid amount
        const newPaidAmount = due.paidAmount + paidAmount;
        paymentToRecord = paidAmount;

        // If fully paid, mark as approved
        if (newPaidAmount >= due.amount) {
          due.status = PaymentStatus.APPROVED;
          due.paidAmount = due.amount;
        } else {
          due.paidAmount = newPaidAmount;
        }
      } else if (status) {
        // Just update the status
        due.status = status;

        // If marking as approved (fully paid), ensure paid amount equals total amount
        if (
          status === PaymentStatus.APPROVED &&
          (due.paidAmount ?? 0) < due.amount
        ) {
          paymentToRecord = due.amount - (due.paidAmount ?? 0);
          due.paidAmount = due.amount;
        }
      }

      // Track member updates if payment occurred
      if (paymentToRecord > 0) {
        const userId = due.userId.toString();
        if (memberUpdates.has(userId)) {
          memberUpdates.set(
            userId,
            memberUpdates.get(userId)! + paymentToRecord
          );
        } else {
          memberUpdates.set(userId, paymentToRecord);
        }
      }

      await due.save({ session });
      updatedDues.push(due);
    }

    // If there are any errors, abort
    if (errors.length > 0) {
      await session.abortTransaction();
      res.status(400).json({
        success: false,
        message: 'Errors in bulk update',
        errors,
      });
      return;
    }

    // Update all members
    for (const [userId, paymentAmount] of memberUpdates.entries()) {
      const member = await Member.findOne({ userId }).session(session);
      if (member) {
        member.duesOwing = Math.max(0, member.duesOwing - paymentAmount);
        member.totalDuesPaid += paymentAmount;
        await member.save({ session });
      }
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedDues.length} dues`,
      data: updatedDues,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in bulk updating dues:', error);
    res.status(500).json({
      success: false,
      message: 'Error in bulk updating dues',
    });
  } finally {
    session.endSession();
  }
};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        username?: string;
        role?: string;
      };
    }
  }
}

export const softDeleteDue = async (
  req: Request,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;
    const { reason } = req.body;

    // Check if user exists in request
    if (!req.user?.id) {
      res.status(401).json({ message: 'User not authenticated' });
      await session.abortTransaction();
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid due ID' });
      await session.abortTransaction();
      return;
    }

    const due = await Due.findById(id).session(session);
    if (!due) {
      res.status(404).json({ message: 'Due not found' });
      await session.abortTransaction();
      return;
    }

    if (due.isDeleted) {
      res.status(400).json({ message: 'Due is already deleted' });
      await session.abortTransaction();
      return;
    }

    // Update the due document with soft delete information
    due.isDeleted = true;
    due.deletedAt = new Date();
    due.deletedBy = new mongoose.Types.ObjectId(req.user.id); // Safe to access after check
    due.deletionReason = reason || 'No reason provided';

    await due.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Due successfully soft deleted',
      dueId: id,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error during soft delete:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to soft delete due',
    });
  } finally {
    session.endSession();
  }
};
// Soft delete multiple dues
export const softDeleteMultipleDues = async (
  req: Request,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { ids, reason } = req.body;
    const deletedBy = req.user?.id ?? 'unknown';

    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ message: 'No valid IDs provided for deletion' });
      return;
    }

    // Validate all IDs
    const invalidIds = ids.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      res.status(400).json({
        message: 'Invalid due IDs found',
        invalidIds,
      });
      return;
    }

    // Find all dues that are not already deleted
    const dues = await Due.find({
      _id: { $in: ids },
      isDeleted: { $ne: true },
    }).session(session);

    if (dues.length === 0) {
      res.status(404).json({ message: 'No dues found for deletion' });
      return;
    }

    // Update all found dues
    const updatePromises = dues.map((due) => {
      due.isDeleted = true;
      due.deletedAt = new Date();
      due.deletedBy = (req as any).user.id;
      due.deletionReason = reason || 'Bulk deletion - no reason provided';
      return due.save({ session });
    });

    await Promise.all(updatePromises);

    await session.commitTransaction();
    res.status(200).json({
      message: `Successfully soft deleted ${dues.length} dues`,
      deletedIds: dues.map((due) => due._id),
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error during bulk soft delete:', error);
    res.status(500).json({
      message: 'Failed to soft delete dues',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    session.endSession();
  }
};

// Restore a soft deleted due
export const restoreSoftDeletedDue = async (
  req: Request,
  res: Response
): Promise<void> => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { id } = req.params;
    const restoredBy = req.user?.id ?? 'unknown';

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid due ID' });
      return;
    }

    const due = await Due.findById(id).session(session);
    if (!due) {
      res.status(404).json({ message: 'Due not found' });
      return;
    }

    if (!due.isDeleted) {
      res
        .status(400)
        .json({ message: 'Due is not deleted and cannot be restored' });
      return;
    }

    // Restore the due document
    due.isDeleted = false;
    due.deletedAt = undefined;
    due.deletedBy = undefined;
    due.deletionReason = undefined;
    due.restoredAt = new Date();
    due.restoredBy = new mongoose.Types.ObjectId(restoredBy);

    await due.save({ session });

    await session.commitTransaction();
    res.status(200).json({
      message: 'Due successfully restored',
      dueId: id,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error during due restoration:', error);
    res.status(500).json({
      message: 'Failed to restore due',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    session.endSession();
  }
};

// Get all soft deleted dues
export const getSoftDeletedDues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Due.countDocuments({ isDeleted: true });

    const softDeletedDues = await Due.find({ isDeleted: true })
      .populate('deletedBy', 'username email') // Assuming user has these fields
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: softDeletedDues,
      pagination: {
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching soft deleted dues:', error);
    res.status(500).json({
      message: 'Failed to fetch soft deleted dues',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
