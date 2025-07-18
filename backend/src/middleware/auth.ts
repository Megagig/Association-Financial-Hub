import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

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

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from cookie or Authorization header
    const tokenFromCookie = req.cookies.auth_token;
    const authHeader = req.headers.authorization;
    const tokenFromHeader =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    const token = tokenFromCookie || tokenFromHeader;

    console.log(
      'Auth middleware - token source:',
      tokenFromCookie ? 'cookie' : tokenFromHeader ? 'header' : 'none'
    );

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JWTPayload;

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
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

// Middleware to check if the user is an admin
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);

    // Check if user has admin or superadmin role
    if (
      !user ||
      (user.role?.toString() !== 'admin' &&
        user.role?.toString() !== 'superadmin')
    ) {
      res
        .status(403)
        .json({ message: 'Access denied. Admin privileges required.' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying admin status' });
  }
};
