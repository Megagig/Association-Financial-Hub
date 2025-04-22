import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';

import {
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionFilterOptions,
  TransactionSummary,
  PaginatedTransactionsResponse,
} from '../types/transaction.types';

export const transactionController = {
  // Create a new transaction
  createTransaction: async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionData: TransactionCreateRequest = req.body;

      const transaction = new Transaction({
        date: new Date(transactionData.date),
        description: transactionData.description,
        amount: transactionData.amount,
        type: transactionData.type,
        category: transactionData.category,
      });

      const savedTransaction = await transaction.save();

      res.status(201).json(savedTransaction);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create transaction', error });
    }
  },

  // Get all transactions with pagination and filtering
  getTransactions: async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const filter: TransactionFilterOptions =
        req.query as unknown as TransactionFilterOptions;
      const query: any = {};

      // Apply filters if provided
      if (filter.startDate && filter.endDate) {
        query.date = {
          $gte: new Date(filter.startDate),
          $lte: new Date(filter.endDate),
        };
      } else if (filter.startDate) {
        query.date = { $gte: new Date(filter.startDate) };
      } else if (filter.endDate) {
        query.date = { $lte: new Date(filter.endDate) };
      }

      if (filter.type) {
        query.type = filter.type;
      }

      if (filter.category) {
        query.category = filter.category;
      }

      if (filter.searchTerm) {
        query.$text = { $search: filter.searchTerm };
      }

      const transactions = await Transaction.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      const count = await Transaction.countDocuments(query);

      const response: PaginatedTransactionsResponse = {
        transactions,
        count,
        page,
        totalPages: Math.ceil(count / limit),
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transactions', error });
    }
  },

  // Get transaction by ID
  getTransactionById: async (req: Request, res: Response): Promise<void> => {
    try {
      const transaction = await Transaction.findById(req.params.id);

      if (!transaction) {
        res.status(404).json({ message: 'Transaction not found' });
        return;
      }

      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch transaction', error });
    }
  },

  // Update transaction
  updateTransaction: async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionData: TransactionUpdateRequest = req.body;

      // Convert date string to Date object if provided
      if (transactionData.date) {
        transactionData.date = new Date(transactionData.date) as any;
      }

      const transaction = await Transaction.findByIdAndUpdate(
        req.params.id,
        { $set: transactionData },
        { new: true }
      );

      if (!transaction) {
        res.status(404).json({ message: 'Transaction not found' });
        return;
      }

      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update transaction', error });
    }
  },

  // Delete transaction
  deleteTransaction: async (req: Request, res: Response): Promise<void> => {
    try {
      const transaction = await Transaction.findByIdAndDelete(req.params.id);

      if (!transaction) {
        res.status(404).json({ message: 'Transaction not found' });
        return;
      }

      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete transaction', error });
    }
  },

  // Get financial summary
  getFinancialSummary: async (_req: Request, res: Response): Promise<void> => {
    try {
      const [incomeResult, expenseResult] = await Promise.all([
        Transaction.aggregate([
          { $match: { type: 'income' } },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
        ]),
        Transaction.aggregate([
          { $match: { type: 'expense' } },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
      const incomeTransactions =
        incomeResult.length > 0 ? incomeResult[0].count : 0;

      const totalExpenses =
        expenseResult.length > 0 ? expenseResult[0].total : 0;
      const expenseTransactions =
        expenseResult.length > 0 ? expenseResult[0].count : 0;

      const summary: TransactionSummary = {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        incomeTransactions,
        expenseTransactions,
      };

      res.status(200).json(summary);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to fetch financial summary', error });
    }
  },

  // Get transactions by category
  getTransactionsByCategory: async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const categoryBreakdown = await Transaction.aggregate([
        {
          $group: {
            _id: { type: '$type', category: '$category' },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.type': 1, '_id.category': 1 } },
      ]);

      res.status(200).json(categoryBreakdown);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to fetch category breakdown', error });
    }
  },

  // Get transactions by month for financial reports
  getMonthlyReport: async (req: Request, res: Response): Promise<void> => {
    try {
      const year =
        parseInt(req.query.year as string) || new Date().getFullYear();

      const monthlyData = await Transaction.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: '$date' },
              type: '$type',
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]);

      // Format the data for frontend display
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const formattedReport = months.map((month) => {
        const incomeData = monthlyData.find(
          (item) => item._id.month === month && item._id.type === 'income'
        );

        const expenseData = monthlyData.find(
          (item) => item._id.month === month && item._id.type === 'expense'
        );

        const income = incomeData ? incomeData.total : 0;
        const expenses = expenseData ? expenseData.total : 0;

        return {
          month,
          monthName: new Date(year, month - 1, 1).toLocaleString('default', {
            month: 'long',
          }),
          income,
          expenses,
          netBalance: income - expenses,
        };
      });

      res.status(200).json(formattedReport);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Failed to generate monthly report', error });
    }
  },
};
