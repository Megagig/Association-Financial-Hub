import axios from 'axios';
import {
  Member,
  Payment,
  Loan,
  Due,
  Report,
  UserSettings,
  FinancialSummary,
  PaymentStatus,
} from '../types';

import {
  RegisterRequest,
  AuthResponse,
  CreatePaymentRequest,
  LoanApplicationRequest,
  UpdateLoanStatusRequest,
  CreateDueRequest,
  UpdateDueStatusRequest,
  GenerateReportRequest,
  UpdateUserSettingsRequest,
} from './api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to login or clear credentials
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },
};

// Members API
export const membersAPI = {
  getAllMembers: async (): Promise<Member[]> => {
    const response = await api.get<Member[]>('/members');
    return response.data;
  },
  getMemberById: async (id: string): Promise<Member> => {
    const response = await api.get<Member>(`/members/${id}`);
    return response.data;
  },
  getMemberByUserId: async (userId: string): Promise<Member> => {
    const response = await api.get<Member>(`/members/user/${userId}`);
    return response.data;
  },
  createMember: async (memberData: Partial<Member>): Promise<Member> => {
    const response = await api.post<Member>('/members', memberData);
    return response.data;
  },
  updateMember: async (
    id: string,
    memberData: Partial<Member>
  ): Promise<Member> => {
    const response = await api.put<Member>(`/members/${id}`, memberData);
    return response.data;
  },
  getMemberPayments: async (id: string): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/members/${id}/payments`);
    return response.data;
  },
  getMemberLoans: async (id: string): Promise<Loan[]> => {
    const response = await api.get<Loan[]>(`/members/${id}/loans`);
    return response.data;
  },
  getFinancialSummary: async (): Promise<FinancialSummary> => {
    const response = await api.get<FinancialSummary>(
      '/members/financial-summary'
    );
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments');
    return response.data;
  },
  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },
  createPayment: async (
    paymentData: CreatePaymentRequest
  ): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', paymentData);
    return response.data;
  },
  updatePaymentStatus: async (
    id: string,
    status: PaymentStatus
  ): Promise<Payment> => {
    const response = await api.put<Payment>(`/payments/${id}/status`, {
      status,
    });
    return response.data;
  },
  getUserPaymentHistory: async (userId: string): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(`/payments/user/${userId}`);
    return response.data;
  },
};

// Loans API
export const loansAPI = {
  getAllLoans: async (): Promise<Loan[]> => {
    const response = await api.get<Loan[]>('/loans');
    return response.data;
  },
  getLoanById: async (id: string): Promise<Loan> => {
    const response = await api.get<Loan>(`/loans/${id}`);
    return response.data;
  },
  applyForLoan: async (loanData: LoanApplicationRequest): Promise<Loan> => {
    const response = await api.post<Loan>('/loans/apply', loanData);
    return response.data;
  },
  updateLoanStatus: async (
    id: string,
    statusData: UpdateLoanStatusRequest
  ): Promise<Loan> => {
    const response = await api.put<Loan>(`/loans/${id}/status`, statusData);
    return response.data;
  },
  getUserLoanHistory: async (userId: string): Promise<Loan[]> => {
    const response = await api.get<Loan[]>(`/loans/user/${userId}`);
    return response.data;
  },
};

// Dues API
export const duesAPI = {
  getAllDues: async (): Promise<Due[]> => {
    const response = await api.get<Due[]>('/dues');
    return response.data;
  },
  getDueById: async (id: string): Promise<Due> => {
    const response = await api.get<Due>(`/dues/${id}`);
    return response.data;
  },
  createDue: async (dueData: CreateDueRequest): Promise<Due> => {
    const response = await api.post<Due>('/dues', dueData);
    return response.data;
  },
  updateDueStatus: async (
    id: string,
    statusData: UpdateDueStatusRequest
  ): Promise<Due> => {
    const response = await api.put<Due>(`/dues/${id}/status`, statusData);
    return response.data;
  },
  getUserDues: async (userId: string): Promise<Due[]> => {
    const response = await api.get<Due[]>(`/dues/user/${userId}`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get<Report[]>('/reports');
    return response.data;
  },
  getReportById: async (id: string): Promise<Report> => {
    const response = await api.get<Report>(`/reports/${id}`);
    return response.data;
  },
  generateReport: async (
    reportData: GenerateReportRequest
  ): Promise<Report> => {
    const response = await api.post<Report>('/reports', reportData);
    return response.data;
  },
};

// User settings API
export const userAPI = {
  getUserSettings: async (userId: string): Promise<UserSettings> => {
    const response = await api.get<UserSettings>(`/user/${userId}/settings`);
    return response.data;
  },
  updateUserSettings: async (
    userId: string,
    settingsData: UpdateUserSettingsRequest
  ): Promise<UserSettings> => {
    const response = await api.put<UserSettings>(
      `/user/${userId}/settings`,
      settingsData
    );
    return response.data;
  },
};

// Export all APIs
export default {
  auth: authAPI,
  members: membersAPI,
  payments: paymentsAPI,
  loans: loansAPI,
  dues: duesAPI,
  reports: reportsAPI,
  user: userAPI,
};
