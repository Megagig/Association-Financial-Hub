import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ToastMessage } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  showToast: (message: ToastMessage) => void;
}

interface LoginResponse {
  user: User;
  token: string;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Add showToast function
  const showToast = (message: ToastMessage) => {
    setToast(message);
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Function to get the auth token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
  };

  // Function to fetch the current user data with the token
  const fetchCurrentUser = React.useCallback(async (): Promise<User | null> => {
    const token = getAuthToken();

    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          return null;
        }
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      return userData.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data: LoginResponse = await response.json();

      // Store the auth token
      localStorage.setItem('authToken', data.token);

      // Set the user in state
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = getAuthToken();

      if (token) {
        // Optional: notify the backend about the logout
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state even if API call fails
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isAdmin: user?.role === UserRole.ADMIN,
    showToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Add Toast component */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
