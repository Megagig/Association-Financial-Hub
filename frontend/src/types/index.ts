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

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export interface AuthContextType {
  showToast: (toastMessage: ToastMessage) => void;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}
