"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_controller_1 = require("../controllers/transaction.controller");
const router = (0, express_1.Router)();
// Transaction CRUD routes
router.post('/', transaction_controller_1.transactionController.createTransaction);
router.get('/', transaction_controller_1.transactionController.getTransactions);
router.get('/:id', transaction_controller_1.transactionController.getTransactionById);
router.put('/:id', transaction_controller_1.transactionController.updateTransaction);
router.delete('/:id', transaction_controller_1.transactionController.deleteTransaction);
// Summary and reporting routes
router.get('/reports/financial-summary', transaction_controller_1.transactionController.getFinancialSummary);
router.get('/reports/category-breakdown', transaction_controller_1.transactionController.getTransactionsByCategory);
router.get('/reports/monthly-report', transaction_controller_1.transactionController.getMonthlyReport);
exports.default = router;
