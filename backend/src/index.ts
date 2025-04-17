import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './db/dbConnect';

const app = express();
// Load environment variables from .env file
const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
