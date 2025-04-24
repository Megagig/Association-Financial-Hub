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
/**Middleware to verify JWT token
and attach user ID to the request object
This middleware checks for the presence of a JWT token in the request cookies,
verifies it, and if valid, extracts the user ID from the token payload.

 */

// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   try {
//     // Check for auth token in cookies
//     const token = req.cookies.auth_token;

//     if (!token) {
//       res.status(401).json({ message: 'Authentication required' });
//       return;
//     }

//     // Verify the token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET_KEY as string
//     ) as JWTPayload;

//     // Add the decoded user to the request object
//     if (typeof decoded === 'object' && 'userId' in decoded) {
//       req.userId = decoded.userId;
//       next();
//     } else {
//       res.status(401).json({ message: 'Invalid token payload' });
//     }
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.auth_token;

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
