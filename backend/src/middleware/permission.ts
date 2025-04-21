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
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is admin
    if (user.role?.toString() !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access denied. Admin privileges required' });
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
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
        return res.status(404).json({ message: 'Member not found' });
      }

      if (member.userId.toString() !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    // If we're checking by userId
    else if (targetUserId) {
      if (targetUserId !== req.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    next();
  } catch (error) {
    console.error('Permission check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
