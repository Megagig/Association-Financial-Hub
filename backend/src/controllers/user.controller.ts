import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

//Register a new user
export async function registerUser(req: Request, res: Response) {
  // 1️⃣ Get validation errors from the request
  const errors = validationResult(req);

  // 2️⃣ If there are validation errors, return them to client
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors.array(),
    });
  }
  try {
    // Get the user data from the request body
    const { email, password, firstName, lastName } = req.body;

    //check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
    }

    //Create a new user instance and save it to the database
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Modify the returned user object to exclude the password
    const { password: savedPassword, ...others } = newUser.toObject();

    //Generate a JWT token for the user
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    // Set token as HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    // Send the user data and token as a response
    res.status(201).json({
      message: 'User registered successfully',
      user: others,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
//update user role
// This function updates the role of a user in the database
// It checks if the requestor is a superadmin before allowing the update
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 1️⃣ Get user ID from request parameters
    const { userId, role } = req.body;
    // 2️⃣ Check if the requestor is a superadmin
    const requestor = await User.findById(req.userId);
    if (requestor?.role?.toString() !== 'superadmin') {
      res.status(403).json({ message: 'Only superadmins can modify roles' });
      return;
    }
    // 3️⃣ Find the user by ID
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true } // Return the updated user
    ).select('-password'); // Exclude password from the response
    // 4️⃣ Check if user was found
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// This function retrieves all admins from the database
// It checks if the requestor is an admin before allowing the retrieval
// export const getAdmins = async (req: Request, res: Response) => {
//   try {
//     // 1️⃣ Get all admins from the database
//     const admins = await User.find({
//       role: { $in: ['admin', 'superadmin'] },
//     }).select('-password');
//     // 2️⃣ Return the list of admins
//     res.status(200).json(admins);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Error fetching admins' });
//   }
// };

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Get all users from the database
    const users = await User.find({}).select('-password');

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};
