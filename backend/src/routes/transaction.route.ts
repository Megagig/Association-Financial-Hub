import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';

const router = Router();

// Transaction CRUD routes
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

// Summary and reporting routes
router.get(
  '/reports/financial-summary',
  transactionController.getFinancialSummary
);
router.get(
  '/reports/category-breakdown',
  transactionController.getTransactionsByCategory
);
router.get('/reports/monthly-report', transactionController.getMonthlyReport);

export default router;
