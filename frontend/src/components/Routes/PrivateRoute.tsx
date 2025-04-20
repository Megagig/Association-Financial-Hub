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
    // Redirect to appropriate dashboard based on role
    return (
      <Navigate to={user.role === 'admin' ? '/admin' : '/member'} replace />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
