import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './db/dbConnect';
import userRoutes from './routes/users.route';

const app = express();
// Load environment variables from .env file
const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
