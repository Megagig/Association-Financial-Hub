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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400000, // 1 day in milliseconds
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

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get user ID from request parameters
    const { userId, role } = req.body;
    // 2️⃣ Check if the requestor is a superadmin
    const requestor = await User.findById(req.userId);
    if (requestor?.role !== 'superadmin') {
      return res
        .status(403)
        .json({ message: 'Only superadmins can modify roles' });
    }
    // 3️⃣ Find the user by ID
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Return the updated user
    ).select('-password'); // Exclude password from the response
    // 4️⃣ Check if user was found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Get all admins from the database
    const admins = await User.find({
      role: { $in: ['admin', 'superadmin'] },
    }).select('-password');
    // 2️⃣ Return the list of admins
    res.status(200).json(admins);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
};
