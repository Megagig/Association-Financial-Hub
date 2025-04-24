import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  // 1️⃣ Get validation errors from the request
  const errors = validationResult(req);

  // 2️⃣ If there are validation errors, return them to client
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
      secure: true,
      sameSite: 'none',
      maxAge: 86400000, // 1 day in milliseconds
      path: '/',
      domain:
        process.env.NODE_ENV === 'production'
          ? '.vercel.app' // Allow sharing between subdomains
          : 'localhost',
    });

    // Remove password from user object before sending
    const userWithoutPassword = {
      _id: existingUser._id,
      email: existingUser.email,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      role: existingUser.role,
    };
    // Return response with user ID
    res
      .status(200)
      .json({ message: 'Login Successfully', user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
