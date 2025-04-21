import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Member } from '../models/member.model';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

interface JWTPayload {
  userId: string;
}
/**Middleware to verify JWT token
and attach user ID to the request object
This middleware checks for the presence of a JWT token in the request cookies,
verifies it, and if valid, extracts the user ID from the token payload.

 */

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Check for auth token in cookies
    const token = req.cookies.auth_token;

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JWTPayload;

    // Add the decoded user to the request object
    if (typeof decoded === 'object' && 'userId' in decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({ message: 'Invalid token payload' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if the user is a superadmin
export const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);

    // Convert the Mongoose schema type to string for comparison
    if (!user || user.role?.toString() !== 'superadmin') {
      res.status(403).json({ message: 'Access denied. Super Admin only.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying super admin status' });
  }
};

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
