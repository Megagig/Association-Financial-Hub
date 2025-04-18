import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

//Register a new user
export async function registerUser(req: Request, res: Response) {
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
