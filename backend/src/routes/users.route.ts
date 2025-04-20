import express from 'express';
import { registerUser } from '../controllers/user.controller';
import { verifyToken, isSuperAdmin } from '../middleware/auth';
import { updateUserRole, getAllUsers } from '../controllers/user.controller';
import { check } from 'express-validator';

//Create a new router instance
const router = express.Router();

router.post(
  '/register',
  [
    check('firstName', 'First name is required').isString(),
    check('lastName', 'Last name is required').isString(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password with six or more characters required').isLength(
      { min: 6 }
    ),
  ],
  registerUser
);

// Define the route for updating user roles
router.put('/:id/role', verifyToken, isSuperAdmin, updateUserRole);
router.get('/', verifyToken, isSuperAdmin, getAllUsers);

export default router;
