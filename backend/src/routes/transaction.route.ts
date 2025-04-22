import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';

const router = Router();

// Transaction CRUD routes
router.post('/transactions', transactionController.createTransaction);
router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/:id', transactionController.getTransactionById);
router.put('/transactions/:id', transactionController.updateTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);

// Summary and reporting routes
router.get('/financial-summary', transactionController.getFinancialSummary);
router.get(
  '/category-breakdown',
  transactionController.getTransactionsByCategory
);
router.get('/monthly-report', transactionController.getMonthlyReport);

export default router;
