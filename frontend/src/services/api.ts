import axios from 'axios';
import {
  Member,
  Payment,
  Loan,
  Due,
  Report,
  UserSettings,
  PaymentStatus,
  FinancialSummary,
  UserRole,
  Admin,
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

import {
  API_BASE_URL,
  API_TIMEOUT,
  INCLUDE_CREDENTIALS,
  TOKEN_STORAGE_KEY,
  ENDPOINTS,
} from '../config/apiConfig';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  withCredentials: INCLUDE_CREDENTIALS,
  timeout: API_TIMEOUT,
});

// Add request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
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
    console.error('API Error:', error);

    if (error.response?.status === 401) {
      // Handle unauthorized access - redirect to login or clear credentials
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      // Only redirect if we're not already on the login page to avoid redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    // Store the token when logging in
    if (response.data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
    }
    return response.data;
  },
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      userData
    );
    // Store the token when registering
    if (response.data.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, response.data.token);
    }
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get<AuthResponse['user']>(
      ENDPOINTS.AUTH.CURRENT_USER
    );
    return response.data;
  },
  logout: async () => {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return response.data;
  },
};

// Members API
export const membersAPI = {
  getAllMembers: async (): Promise<Member[]> => {
    try {
      const response = await api.get<{
        success: boolean;
        data: Member[];
        pagination: any;
      }>(ENDPOINTS.MEMBERS.BASE);
      return response.data.data; // Return the data array from the response
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },
  getMemberById: async (id: string): Promise<Member> => {
    const response = await api.get<Member>(ENDPOINTS.MEMBERS.DETAIL(id));
    return response.data;
  },
  getMemberByUserId: async (userId: string): Promise<Member> => {
    const response = await api.get<Member>(ENDPOINTS.MEMBERS.BY_USER(userId));
    return response.data;
  },
  createMember: async (memberData: Partial<Member>): Promise<Member> => {
    const response = await api.post<Member>(ENDPOINTS.MEMBERS.BASE, memberData);
    return response.data;
  },
  updateMember: async (
    id: string,
    memberData: Partial<Member>
  ): Promise<Member> => {
    const response = await api.put<Member>(
      ENDPOINTS.MEMBERS.DETAIL(id),
      memberData
    );
    return response.data;
  },
  getMemberPayments: async (id: string): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(ENDPOINTS.MEMBERS.PAYMENTS(id));
    return response.data;
  },
  getMemberLoans: async (id: string): Promise<Loan[]> => {
    const response = await api.get<Loan[]>(ENDPOINTS.MEMBERS.LOANS(id));
    return response.data;
  },
  getFinancialSummary: async (): Promise<FinancialSummary> => {
    const response = await api.get<FinancialSummary>(
      ENDPOINTS.MEMBERS.FINANCIAL_SUMMARY
    );
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(ENDPOINTS.PAYMENTS.BASE);
    return response.data;
  },
  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await api.get<Payment>(ENDPOINTS.PAYMENTS.DETAIL(id));
    return response.data;
  },
  createPayment: async (
    paymentData: CreatePaymentRequest
  ): Promise<Payment> => {
    const response = await api.post<Payment>(
      ENDPOINTS.PAYMENTS.BASE,
      paymentData
    );
    return response.data;
  },
  updatePaymentStatus: async (
    id: string,
    status: PaymentStatus
  ): Promise<Payment> => {
    const response = await api.put<Payment>(
      ENDPOINTS.PAYMENTS.UPDATE_STATUS(id),
      { status }
    );
    return response.data;
  },
  getUserPaymentHistory: async (userId: string): Promise<Payment[]> => {
    const response = await api.get<Payment[]>(
      ENDPOINTS.PAYMENTS.USER_HISTORY(userId)
    );
    return response.data;
  },
};

// Loans API
export const loansAPI = {
  getAllLoans: async (): Promise<Loan[]> => {
    const response = await api.get<Loan[]>(ENDPOINTS.LOANS.BASE);
    return response.data;
  },
  getLoanById: async (id: string): Promise<Loan> => {
    const response = await api.get<Loan>(ENDPOINTS.LOANS.DETAIL(id));
    return response.data;
  },
  applyForLoan: async (loanData: LoanApplicationRequest): Promise<Loan> => {
    const response = await api.post<Loan>(ENDPOINTS.LOANS.APPLY, loanData);
    return response.data;
  },
  updateLoanStatus: async (
    id: string,
    statusData: UpdateLoanStatusRequest
  ): Promise<Loan> => {
    const response = await api.put<Loan>(
      ENDPOINTS.LOANS.UPDATE_STATUS(id),
      statusData
    );
    return response.data;
  },
  getUserLoanHistory: async (userId: string): Promise<Loan[]> => {
    const response = await api.get<Loan[]>(
      ENDPOINTS.LOANS.USER_HISTORY(userId)
    );
    return response.data;
  },
};

// Dues API
export const duesAPI = {
  getAllDues: async (): Promise<Due[]> => {
    const response = await api.get<Due[]>(ENDPOINTS.DUES.BASE);
    return response.data;
  },
  getDueById: async (id: string): Promise<Due> => {
    const response = await api.get<Due>(ENDPOINTS.DUES.DETAIL(id));
    return response.data;
  },
  createDue: async (dueData: CreateDueRequest): Promise<Due> => {
    const response = await api.post<Due>(ENDPOINTS.DUES.BASE, dueData);
    return response.data;
  },
  updateDueStatus: async (
    id: string,
    statusData: UpdateDueStatusRequest
  ): Promise<Due> => {
    const response = await api.put<Due>(
      ENDPOINTS.DUES.UPDATE_STATUS(id),
      statusData
    );
    return response.data;
  },
  getUserDues: async (userId: string): Promise<Due[]> => {
    const response = await api.get<Due[]>(ENDPOINTS.DUES.USER_DUES(userId));
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getAllReports: async (): Promise<Report[]> => {
    const response = await api.get<Report[]>(ENDPOINTS.REPORTS.BASE);
    return response.data;
  },
  getReportById: async (id: string): Promise<Report> => {
    const response = await api.get<Report>(ENDPOINTS.REPORTS.DETAIL(id));
    return response.data;
  },
  generateReport: async (
    reportData: GenerateReportRequest
  ): Promise<Report> => {
    const response = await api.post<Report>(ENDPOINTS.REPORTS.BASE, reportData);
    return response.data;
  },
};

// User settings API
export const userAPI = {
  getUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  updateUserRole: async (userId: string, role: UserRole) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },
  getUserSettings: async (userId: string): Promise<UserSettings> => {
    const response = await api.get<UserSettings>(
      ENDPOINTS.USER.SETTINGS(userId)
    );
    return response.data;
  },
  updateUserSettings: async (
    userId: string,
    settingsData: UpdateUserSettingsRequest
  ): Promise<UserSettings> => {
    const response = await api.put<UserSettings>(
      ENDPOINTS.USER.SETTINGS(userId),
      settingsData
    );
    return response.data;
  },

  getAdminProfile: async (userId: string): Promise<Admin> => {
    const response = await api.get<Admin>(`/api/users/${userId}/profile`);
    return response.data;
  },

  updateAdminProfile: async (
    userId: string,
    data: Partial<Admin>
  ): Promise<void> => {
    await api.put(`/api/users/${userId}/profile`, data);
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
