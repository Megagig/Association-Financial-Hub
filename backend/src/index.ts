import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './db/dbConnect';
import userRoutes from './routes/users.route';
import authRoutes from './routes/auth.route';
import memberRoutes from './routes/member.route';
import paymentRoutes from './routes/payment.route';
import loanRoutes from './routes/loan.route';
import dueRoutes from './routes/due.route';
import reportRoutes from './routes/report.route';
import userSettingRoutes from './routes/userSetting.route';
import transactionRoutes from './routes/transaction.route';

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
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: [
      'https://savio-96-financial-hub.vercel.app',
      'http://localhost:5173', // development URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'],
  })
);

app.set('trust proxy', 1); // trust first proxy for secure cookies

// root route
app.get('/', (req, res) => {
  res.send('API is running successfully');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/dues', dueRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/user-settings', userSettingRoutes);
app.use('/api/transactions', transactionRoutes);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
