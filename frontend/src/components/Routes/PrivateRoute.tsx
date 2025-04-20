import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    // Redirect based on role
    if (user.role === UserRole.SUPERADMIN) {
      return <Navigate to="/admin" replace />;
    } else if (user.role === UserRole.ADMIN) {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/member" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
