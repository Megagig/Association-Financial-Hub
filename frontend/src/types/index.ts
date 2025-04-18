export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

// Define Toast Message interface
export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  memberSince: string;
  membershipId: string;
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
