export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

// Define Toast Message Type
export type ToastMessage = {
  message: string;
  type: 'success' | 'error';
};

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
