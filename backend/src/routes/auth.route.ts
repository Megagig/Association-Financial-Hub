import express from 'express';
import { loginUser } from '../controllers/auth.controller';
import { check } from 'express-validator';
import { verifyToken } from '../middleware/auth';
import { Request, Response } from 'express';
import User from '../models/user.model';

// Create a new router instance
const router = express.Router();
// Define the routes for user-related operations
router.post(
  '/login',
  [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password with six or more characters required').isLength(
      { min: 6 }
    ),
  ],

  loginUser
);

router.get(
  '/validate-token',
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post('/logout', (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    expires: new Date(0),
  });
  res.send({});
});

export default router;
