import {
  Member,
  Payment,
  Loan,
  Due,
  Report,
  UserSettings,
  FinancialSummary,
  PaymentStatus,
  LoanStatus,
} from '../types';

// Auth API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

// Payment API types
export interface CreatePaymentRequest {
  userId: string;
  amount: number;
  type: string;
  description: string;
  date?: string;
  receiptUrl?: string;
}

export interface UpdatePaymentStatusRequest {
  status: PaymentStatus;
}

// Loan API types
export interface LoanApplicationRequest {
  userId: string;
  amount: number;
  purpose: string;
  applicationDate?: string;
  repaymentTerms: string;
  dueDate?: string;
  status?: LoanStatus;
}

export interface UpdateLoanStatusRequest {
  status: LoanStatus;
  approvedBy?: string;
  approvalDate?: string;
  comments?: string;
}

// Due API types
export interface CreateDueRequest {
  userId: string;
  title: string;
  description: string;
  amount: number;
  type: string;
  dueDate: string;
  issuedBy: string;
}

export interface UpdateDueStatusRequest {
  status: PaymentStatus;
  paidAmount?: number;
}

// Report API types
export interface GenerateReportRequest {
  title: string;
  description: string;
  dateRange: {
    from: string;
    to: string;
  };
  type: string;
  generatedBy: string;
}

// User settings API types
export interface UpdateUserSettingsRequest {
  emailNotifications?: boolean;
  paymentReminders?: boolean;
  dueReminders?: boolean;
  theme?: string;
  language?: string;
}

// Add proper error types
export interface ApiError extends Error {
  code?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}
