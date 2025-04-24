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
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://savio-96-financial-hub.vercel.app',
  'https://savio-96-alumni.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
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
