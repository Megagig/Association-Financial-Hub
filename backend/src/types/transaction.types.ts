export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Dues'
  | 'Donation'
  | 'Event'
  | 'Administrative'
  | 'Other';

export interface ITransaction {
  id?: string;
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

// Request types
export interface TransactionCreateRequest {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

export interface TransactionUpdateRequest {
  date?: string;
  description?: string;
  amount?: number;
  type?: TransactionType;
  category?: TransactionCategory;
}

export interface TransactionFilterOptions {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  searchTerm?: string;
}

// Response types
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeTransactions: number;
  expenseTransactions: number;
}

export interface PaginatedTransactionsResponse {
  transactions: ITransaction[];
  count: number;
  page: number;
  totalPages: number;
}
