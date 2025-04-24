// Modified apiConfig.ts - Ensuring consistency in endpoints

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Request timeout in milliseconds (15 seconds)
export const API_TIMEOUT = 15000;

// Whether to include credentials with requests (cookies, etc.)
export const INCLUDE_CREDENTIALS = true;

// Token storage key in localStorage
export const TOKEN_STORAGE_KEY = 'auth_token';

// API endpoints - Ensuring consistency between client and server
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CURRENT_USER: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  // Member endpoints - Making sure these match your backend routes
  MEMBERS: {
    BASE: '/api/members', // This should match where you mount your router in Express
    DETAIL: (id: string) => `/api/members/${id}`,
    BY_USER: (userId: string) => `/api/members/user/${userId}`,
    PAYMENTS: (id: string) => `/api/members/${id}/payments`,
    LOANS: (id: string) => `/api/members/${id}/loans`,
    FINANCIAL_SUMMARY: '/api/members/financial-summary',
  },

  // Payment endpoints - Ensuring consistency with prefixes
  PAYMENTS: {
    BASE: '/api/payments', // Added /api prefix for consistency
    DETAIL: (id: string) => `/api/payments/${id}`,
    UPDATE_STATUS: (id: string) => `/api/payments/${id}/status`,
    USER_HISTORY: (userId: string) => `/api/payments/user/${userId}`,
  },

  // Loan endpoints - Ensuring consistency with prefixes
  LOANS: {
    BASE: '/api/loans', // Added /api prefix for consistency
    DETAIL: (id: string) => `/api/loans/${id}`,
    APPLY: '/api/loans/apply',
    UPDATE_STATUS: (id: string) => `/api/loans/${id}/status`,
    USER_HISTORY: (userId: string) => `/api/loans/user/${userId}`,
  },

  // Dues endpoints - Ensuring consistency with prefixes
  DUES: {
    BASE: '/api/dues', // Added /api prefix for consistency
    DETAIL: (id: string) => `/api/dues/${id}`,
    UPDATE_STATUS: (id: string) => `/api/dues/${id}/status`,
    USER_DUES: (userId: string) => `/api/dues/user/${userId}`,
  },

  // Report endpoints - Ensuring consistency with prefixes
  REPORTS: {
    BASE: '/api/reports', // Added /api prefix for consistency
    DETAIL: (id: string) => `/api/reports/${id}`,
  },

  // User settings endpoints - Ensuring consistency with prefixes
  USER: {
    BASE: '/api/users',
    PROFILE: (userId: string) => `/api/users/${userId}/profile`,
    SETTINGS: (userId: string) => `/api/user/${userId}/settings`,
    ROLE: (userId: string) => `/api/users/${userId}/role`,
  },
};
