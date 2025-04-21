import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { Member } from '../models/member.model';

/**
 * Middleware to verify admin privileges
 * Must be used after verifyToken middleware
 */

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is admin
    if (user.role?.toString() !== 'admin') {
      res
        .status(403)
        .json({ message: 'Access denied. Admin privileges required' });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Error verifying admin status' });
  }
};

/**
 * Middleware to check if user can access specific member data
 * Must be used after verifyToken middleware
 */

export const canAccessMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Admin can access any member
    if (
      user.role?.toString() === 'admin' ||
      user.role?.toString() === 'superadmin'
    ) {
      return next();
    }

    const memberId = req.params.id;
    const targetUserId = req.params.userId || (req.query.userId as string);

    // If we're checking by memberId
    if (memberId) {
      const member = await Member.findById(memberId);
      if (!member) {
        res.status(404).json({ message: 'Member not found' });
        return;
      }

      if (member.userId.toString() !== req.userId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }
    // If we're checking by userId
    else if (targetUserId) {
      if (targetUserId !== req.userId) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Permission check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const isAdminOrSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);

    // Allow both admin and superadmin roles
    if (
      !user ||
      (user.role?.toString() !== 'admin' &&
        user.role?.toString() !== 'superadmin')
    ) {
      res
        .status(403)
        .json({ message: 'Access denied. Admin or Super Admin only.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying admin status' });
  }
};
