import e from 'express';
import express from 'express';
import { registerUser } from '../controllers/user.controller';

//Create a new router instance
const router = express.Router();

router.post('/users', registerUser);

export default router;
