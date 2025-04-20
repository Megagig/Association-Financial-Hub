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

// export default verifyToken;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

// ...existing code...

export const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== 'superadmin') {
      return res
        .status(403)
        .json({ message: 'Access denied. Super Admin only.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Error verifying super admin status' });
  }
};
