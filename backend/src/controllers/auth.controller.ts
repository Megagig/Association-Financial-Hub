import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  // Get validation errors from the request
  const errors = validationResult(req);

  // If there are validation errors, return them to client
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array() });
    return;
  }

  // Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Find user by email in database
    const existingUser = await User.findOne({ email });

    // Check if user exists
    if (!existingUser) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, existingUser.password);

    // Check if passwords match
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    // Set HTTP cookie with token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // True in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000, // 1 day
      path: '/',
      // Don't set domain unless you're using different subdomains
    });

    // Remove password from user object before sending
    const userWithoutPassword = {
      _id: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      role: existingUser.role,
    };

    // Return response with user ID and token
    res.status(200).json({
      message: 'Login Successfully',
      user: userWithoutPassword,
      token, // Include the token in the response
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const validateToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Log received cookies for debugging
    console.log('Received cookies:', req.cookies);
    console.log('Auth token from cookie:', req.cookies.auth_token);

    // Get token from cookie or Authorization header
    const tokenFromCookie = req.cookies.auth_token;
    const authHeader = req.headers.authorization;
    const tokenFromHeader =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    const token = tokenFromCookie || tokenFromHeader;

    console.log('Using token:', token ? 'Token exists' : 'No token found');

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    // Find the user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    // Generate a fresh token
    const refreshedToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    // Set refreshed token in cookie
    res.cookie('auth_token', refreshedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000, // 1 day
      path: '/',
    });

    // Return user data and refreshed token
    res.json({
      user,
      token: refreshedToken, // Include refreshed token in response
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Clear the auth cookie
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0), // Expire immediately
      path: '/',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Something went wrong during logout' });
  }
};
