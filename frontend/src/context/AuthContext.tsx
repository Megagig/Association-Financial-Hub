// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { User, UserRole, ToastMessage } from '../types';

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<string>;
//   logout: () => void;
//   isAdmin: boolean;
//   showToast: (message: ToastMessage) => void;
// }

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [toast, setToast] = useState<ToastMessage | null>(null);

//   // Add showToast function
//   const showToast = (message: ToastMessage) => {
//     setToast(message);
//     // Auto-hide toast after 3 seconds
//     setTimeout(() => {
//       setToast(null);
//     }, 3000);
//   };

//   // Function to fetch the current user data using cookies
//   const fetchCurrentUser = React.useCallback(async (): Promise<User | null> => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           return null;
//         }
//         throw new Error('Failed to fetch user data');
//       }

//       const data = await response.json();
//       return data.user; // Return the user object directly
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//       return null;
//     }
//   }, []);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       setIsLoading(true);
//       try {
//         const currentUser = await fetchCurrentUser();
//         if (currentUser) {
//           setUser(currentUser);
//         }
//       } catch (error) {
//         console.error('Authentication initialization error:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeAuth();
//   }, [fetchCurrentUser]);

//   const login = async (email: string, password: string): Promise<string> => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Authentication failed');
//       }

//       if (!data.user) {
//         throw new Error('No user data received');
//       }

//       // Format the role correctly to match enum
//       const userWithCorrectRole: User = {
//         ...data.user,
//         role: data.user.role.toLowerCase() as UserRole,
//       };
//       setUser(userWithCorrectRole);

//       // Determine redirect path based on role
//       if (
//         userWithCorrectRole.role === UserRole.SUPERADMIN ||
//         userWithCorrectRole.role === UserRole.ADMIN
//       ) {
//         return '/admin';
//       }
//       return '/member';
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = async (): Promise<void> => {
//     try {
//       await fetch(`${API_BASE_URL}/api/auth/logout`, {
//         method: 'POST',
//         credentials: 'include', // Important for sending cookies
//       });
//     } catch (error) {
//       console.error('Logout API error:', error);
//     } finally {
//       setUser(null);
//     }
//   };

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isLoading,
//     login,
//     logout,
//     isAdmin: user?.role === UserRole.ADMIN,
//     showToast,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//       {/* Add Toast component */}
//       {toast && (
//         <div
//           className={`fixed bottom-4 right-4 px-4 py-2 rounded-md text-white ${
//             toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//           }`}
//         >
//           {toast.message}
//         </div>
//       )}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

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
  import.meta.env.VITE_API_BASE_URL || 'https://savio-96-alumni.vercel.app';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: ToastMessage) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Function to fetch the current user data using cookies
  const fetchCurrentUser = React.useCallback(async (): Promise<User | null> => {
    try {
      console.log(
        'Fetching current user from:',
        `${API_BASE_URL}/api/auth/validate-token`
      );

      const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('User not authenticated (401)');
          return null;
        }
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      console.log('Received user data:', data);

      // Check if user data has expected structure
      if (!data.user) {
        console.error('Invalid user data format:', data);
        return null;
      }

      // Check if ID exists and log it
      if (data.user._id && !data.user.id) {
        console.log('User has _id but not id, normalizing:', data.user._id);
        data.user.id = data.user._id; // Normalize MongoDB _id to id
      }

      if (!data.user.id && !data.user._id) {
        console.error('User object is missing an ID property:', data.user);
      } else {
        console.log('Found user ID:', data.user.id || data.user._id);
      }

      return data.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        console.log('Initializing authentication...');
        const currentUser = await fetchCurrentUser();

        if (currentUser) {
          console.log('Setting authenticated user:', currentUser);

          // Normalize ID if needed
          if (currentUser._id && !currentUser.id) {
            currentUser.id = currentUser._id;
          }

          setUser(currentUser);
        } else {
          console.log('No authenticated user found');
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        console.log('Authentication initialization completed');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string): Promise<string> => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (!data.user) {
        throw new Error('No user data received');
      }

      // Format the role correctly to match enum
      const userWithCorrectRole: User = {
        ...data.user,
        role: data.user.role.toLowerCase() as UserRole,
      };

      // Handle potential _id vs id issue (common in MongoDB backends)
      if (userWithCorrectRole._id && !userWithCorrectRole.id) {
        userWithCorrectRole.id = userWithCorrectRole._id;
      }

      console.log('Processed user object:', userWithCorrectRole);
      setUser(userWithCorrectRole);

      // Determine redirect path based on role
      if (
        userWithCorrectRole.role === UserRole.SUPERADMIN ||
        userWithCorrectRole.role === UserRole.ADMIN
      ) {
        return '/admin';
      }
      return '/member';
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Logging out user');
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important for sending cookies
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      setUser(null);
      console.log('User logged out');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    isAdmin:
      user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN,
    showToast,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
