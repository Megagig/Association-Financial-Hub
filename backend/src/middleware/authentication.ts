import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Member } from '../models/member.model';

// Extended request interface with user property
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// JWT payload interface
interface JwtPayload {
  id: string;
  role?: string;
}

/**
 * Middleware to authenticate user based on JWT token
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add user to request object for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to verify admin privileges
 * Must be used after authenticate middleware
 */
export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Access denied. Admin privileges required' });
  }

  next();
};

/**
 * Middleware to check if user can access specific member data
 * Must be used after authenticate middleware
 */
export const canAccessMember = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Admin can access any member
    if (req.user.role === 'admin') {
      return next();
    }

    const memberId = req.params.id;
    const userId = req.params.userId || (req.query.userId as string);

    // If we're checking by memberId
    if (memberId) {
      const member = await Member.findById(memberId);
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }

      if (member.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    // If we're checking by userId
    else if (userId) {
      if (userId !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    next();
  } catch (error) {
    console.error('Permission check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
