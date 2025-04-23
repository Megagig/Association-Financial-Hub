"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
exports.transactionController = {
    // Create a new transaction
    createTransaction: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transactionData = req.body;
            const transaction = new transaction_model_1.default({
                date: new Date(transactionData.date),
                description: transactionData.description,
                amount: transactionData.amount,
                type: transactionData.type,
                category: transactionData.category,
            });
            const savedTransaction = yield transaction.save();
            res.status(201).json(savedTransaction);
        }
        catch (error) {
            res.status(400).json({ message: 'Failed to create transaction', error });
        }
    }),
    // Get all transactions with pagination and filtering
    getTransactions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const filter = req.query;
            const query = {};
            // Apply filters if provided
            if (filter.startDate && filter.endDate) {
                query.date = {
                    $gte: new Date(filter.startDate),
                    $lte: new Date(filter.endDate),
                };
            }
            else if (filter.startDate) {
                query.date = { $gte: new Date(filter.startDate) };
            }
            else if (filter.endDate) {
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
            const transactions = yield transaction_model_1.default.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit);
            const count = yield transaction_model_1.default.countDocuments(query);
            const response = {
                transactions,
                count,
                page,
                totalPages: Math.ceil(count / limit),
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to fetch transactions', error });
        }
    }),
    // Get transaction by ID
    getTransactionById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield transaction_model_1.default.findById(req.params.id);
            if (!transaction) {
                res.status(404).json({ message: 'Transaction not found' });
                return;
            }
            res.status(200).json(transaction);
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to fetch transaction', error });
        }
    }),
    // Update transaction
    updateTransaction: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transactionData = req.body;
            // Convert date string to Date object if provided
            if (transactionData.date) {
                transactionData.date = new Date(transactionData.date);
            }
            const transaction = yield transaction_model_1.default.findByIdAndUpdate(req.params.id, { $set: transactionData }, { new: true });
            if (!transaction) {
                res.status(404).json({ message: 'Transaction not found' });
                return;
            }
            res.status(200).json(transaction);
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to update transaction', error });
        }
    }),
    // Delete transaction
    deleteTransaction: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield transaction_model_1.default.findByIdAndDelete(req.params.id);
            if (!transaction) {
                res.status(404).json({ message: 'Transaction not found' });
                return;
            }
            res.status(200).json({ message: 'Transaction deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: 'Failed to delete transaction', error });
        }
    }),
    // Get financial summary
    getFinancialSummary: (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [incomeResult, expenseResult] = yield Promise.all([
                transaction_model_1.default.aggregate([
                    { $match: { type: 'income' } },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: '$amount' },
                            count: { $sum: 1 },
                        },
                    },
                ]),
                transaction_model_1.default.aggregate([
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
            const incomeTransactions = incomeResult.length > 0 ? incomeResult[0].count : 0;
            const totalExpenses = expenseResult.length > 0 ? expenseResult[0].total : 0;
            const expenseTransactions = expenseResult.length > 0 ? expenseResult[0].count : 0;
            const summary = {
                totalIncome,
                totalExpenses,
                netBalance: totalIncome - totalExpenses,
                incomeTransactions,
                expenseTransactions,
            };
            res.status(200).json(summary);
        }
        catch (error) {
            res
                .status(500)
                .json({ message: 'Failed to fetch financial summary', error });
        }
    }),
    // Get transactions by category
    getTransactionsByCategory: (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const categoryBreakdown = yield transaction_model_1.default.aggregate([
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
        }
        catch (error) {
            res
                .status(500)
                .json({ message: 'Failed to fetch category breakdown', error });
        }
    }),
    // Get transactions by month for financial reports
    getMonthlyReport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const year = parseInt(req.query.year) || new Date().getFullYear();
            const monthlyData = yield transaction_model_1.default.aggregate([
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
                const incomeData = monthlyData.find((item) => item._id.month === month && item._id.type === 'income');
                const expenseData = monthlyData.find((item) => item._id.month === month && item._id.type === 'expense');
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
        }
        catch (error) {
            res
                .status(500)
                .json({ message: 'Failed to generate monthly report', error });
        }
    }),
};
