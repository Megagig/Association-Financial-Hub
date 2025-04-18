import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ToastMessage } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
  isAdmin: boolean;
  showToast: (message: ToastMessage) => void;
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

  // Function to fetch the current user data using cookies
  const fetchCurrentUser = React.useCallback(async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: 'include', // Important for sending cookies
      });

      if (!response.ok) {
        if (response.status === 401) {
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

  const login = async (email: string, password: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include', // Important for receiving cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug the response

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (!data.user) {
        throw new Error('No user data received');
      }
      console.log('Setting user:', data.user); // Log the user being set

      setUser(data.user);
      // Use case-insensitive comparison
      const userRole = data.user.role.toUpperCase();
      console.log('User role (normalized):', userRole);

      // Log the role for debugging
      console.log('User role:', data.user.role);
      console.log('Normalized role:', userRole);

      const redirectPath = userRole === 'ADMIN' ? '/admin' : '/member';
      console.log('Redirect path determined:', redirectPath);

      return redirectPath;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important for sending cookies
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
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
