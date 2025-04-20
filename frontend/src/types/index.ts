export enum UserRole {
  ADMIN = 'admin', // Match backend casing
  USER = 'user', // Match backend casing
}
// Define form data type
export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface User {
  id(id: any): unknown;
  _id: string; // Match backend field name
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

// // Define Toast Message interface
// export interface ToastMessage {
//   message: string;
//   type: 'success' | 'error';
// }

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   avatar?: string;
//   memberSince: string;
//   membershipId: string;
// }

// Remove duplicate User interface
export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

export interface AuthContextType {
  showToast: (toastMessage: ToastMessage) => void;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export enum DueType {
  ANNUAL = 'annual',
  MONTHLY = 'monthly',
  SPECIAL = 'special',
  OTHER = 'other',
}

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   avatar?: string;
//   memberSince: string;
//   membershipId: string;
// }

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  type: 'dues' | 'donation' | 'pledge';
  description: string;
  date: string;
  status: PaymentStatus;
  receiptUrl?: string;
}

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  purpose: string;
  applicationDate: string;
  status: LoanStatus;
  approvedBy?: string;
  approvalDate?: string;
  repaymentTerms?: string;
  dueDate?: string;
}

export interface Due {
  id: string;
  userId: string;
  title: string;
  description: string;
  amount: number;
  type: DueType;
  createdAt: string;
  dueDate: string;
  status: PaymentStatus;
  paidAmount?: number;
  issuedBy: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipId: string;
  graduationYear: string;
  memberSince: string;
  department: string;
  currentWorkplace?: string;
  currentPosition?: string;
  avatar?: string;
  totalDuesPaid: number;
  duesOwing: number;
  totalDonations: number;
  activeLoans: number;
  loanBalance: number;
}

export interface FinancialSummary {
  totalMembers: number;
  totalDuesCollected: number;
  totalDuesPending: number;
  totalDonations: number;
  totalPledges: number;
  totalLoansDisbursed: number;
  totalLoansRepaid: number;
  pendingLoanApplications: number;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  dateRange: {
    from: string;
    to: string;
  };
  type: 'dues' | 'payments' | 'loans' | 'donations' | 'summary' | 'member';
  generatedBy: string;
  generatedAt: string;
  data: any; // This would be the report data structure
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  paymentReminders: boolean;
  dueReminders: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  createdBy: string;
  createdAt: string;
  notes?: string;
  receipt?: string;
}
