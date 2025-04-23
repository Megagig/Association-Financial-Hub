import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Members API
export const membersAPI = {
  getAllMembers: async () => {
    const response = await api.get('/members');
    return response.data;
  },
  getMemberById: async (id: string) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },
  getMemberByUserId: async (userId: string) => {
    const response = await api.get(`/members/user/${userId}`);
    return response.data;
  },
  createMember: async (memberData: any) => {
    const response = await api.post('/members', memberData);
    return response.data;
  },
  updateMember: async (id: string, memberData: any) => {
    const response = await api.put(`/members/${id}`, memberData);
    return response.data;
  },
  getMemberPayments: async (id: string) => {
    const response = await api.get(`/members/${id}/payments`);
    return response.data;
  },
  getMemberLoans: async (id: string) => {
    const response = await api.get(`/members/${id}/loans`);
    return response.data;
  },
  getFinancialSummary: async () => {
    const response = await api.get('/members/financial-summary');
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },
  getPaymentById: async (id: string) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
  createPayment: async (paymentData: any) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
  updatePaymentStatus: async (id: string, status: string) => {
    const response = await api.put(`/payments/${id}/status`, { status });
    return response.data;
  },
  getUserPaymentHistory: async (userId: string) => {
    const response = await api.get(`/payments/user/${userId}`);
    return response.data;
  },
};

// Loans API
export const loansAPI = {
  getAllLoans: async () => {
    const response = await api.get('/loans');
    return response.data;
  },
  getLoanById: async (id: string) => {
    const response = await api.get(`/loans/${id}`);
    return response.data;
  },
  applyForLoan: async (loanData: any) => {
    const response = await api.post('/loans/apply', loanData);
    return response.data;
  },
  updateLoanStatus: async (id: string, statusData: any) => {
    const response = await api.put(`/loans/${id}/status`, statusData);
    return response.data;
  },
  getUserLoanHistory: async (userId: string) => {
    const response = await api.get(`/loans/user/${userId}`);
    return response.data;
  },
};

// Dues API
export const duesAPI = {
  getAllDues: async () => {
    const response = await api.get('/dues');
    return response.data;
  },
  getDueById: async (id: string) => {
    const response = await api.get(`/dues/${id}`);
    return response.data;
  },
  createDue: async (dueData: any) => {
    const response = await api.post('/dues', dueData);
    return response.data;
  },
  updateDueStatus: async (id: string, statusData: any) => {
    const response = await api.put(`/dues/${id}/status`, statusData);
    return response.data;
  },
  getUserDues: async (userId: string) => {
    const response = await api.get(`/dues/user/${userId}`);
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getAllReports: async () => {
    const response = await api.get('/reports');
    return response.data;
  },
  getReportById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },
  generateReport: async (reportData: any) => {
    const response = await api.post('/reports', reportData);
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
