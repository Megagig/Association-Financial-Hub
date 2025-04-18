import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include userId
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

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  // Check if the token is present in the cookies
  // The token is expected to be in the 'auth_token' cookie
  const token = req.cookies.auth_token;

  // If the token is not present, respond with 401 Unauthorized
  // This means the user is not authenticated
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Verify the token using the secret key
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JWTPayload;

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
};

export default verifyToken;
