import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './db/dbConnect';
import userRoutes from './routes/users.route';
import authRoutes from './routes/auth.route';
import memberRoutes from './routes/member.route';

const app = express();
// Load environment variables from .env file
const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS for the frontend URL
// This allows the frontend to make requests to the backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/members', memberRoutes);
// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
