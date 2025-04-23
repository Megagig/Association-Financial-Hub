// src/config/apiConfig.ts

// API base URL - fallback to localhost if not defined in env variables
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Request timeout in milliseconds (15 seconds)
export const API_TIMEOUT = 15000;

// Whether to include credentials with requests (cookies, etc.)
export const INCLUDE_CREDENTIALS = true;

// Token storage key in localStorage
export const TOKEN_STORAGE_KEY = 'auth_token';

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CURRENT_USER: '/auth/me',
    LOGOUT: '/auth/logout',
  },

  // Member endpoints
  MEMBERS: {
    BASE: '/members',
    DETAIL: (id: string) => `/members/${id}`,
    BY_USER: (userId: string) => `/members/user/${userId}`,
    PAYMENTS: (id: string) => `/members/${id}/payments`,
    LOANS: (id: string) => `/members/${id}/loans`,
    FINANCIAL_SUMMARY: '/members/financial-summary',
  },

  // Payment endpoints
  PAYMENTS: {
    BASE: '/payments',
    DETAIL: (id: string) => `/payments/${id}`,
    UPDATE_STATUS: (id: string) => `/payments/${id}/status`,
    USER_HISTORY: (userId: string) => `/payments/user/${userId}`,
  },

  // Loan endpoints
  LOANS: {
    BASE: '/loans',
    DETAIL: (id: string) => `/loans/${id}`,
    APPLY: '/loans/apply',
    UPDATE_STATUS: (id: string) => `/loans/${id}/status`,
    USER_HISTORY: (userId: string) => `/loans/user/${userId}`,
  },

  // Dues endpoints
  DUES: {
    BASE: '/dues',
    DETAIL: (id: string) => `/dues/${id}`,
    UPDATE_STATUS: (id: string) => `/dues/${id}/status`,
    USER_DUES: (userId: string) => `/dues/user/${userId}`,
  },

  // Report endpoints
  REPORTS: {
    BASE: '/reports',
    DETAIL: (id: string) => `/reports/${id}`,
  },

  // User settings endpoints
  USER: {
    SETTINGS: (userId: string) => `/user/${userId}/settings`,
  },
};
