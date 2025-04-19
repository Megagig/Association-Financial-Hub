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

  // Convert roles to lowercase for comparison
  const userRole = user.role.toLowerCase();
  const hasAllowedRole = allowedRoles.some(
    (role) => role.toLowerCase() === userRole
  );

  if (!hasAllowedRole) {
    return (
      <Navigate
        to={userRole === UserRole.ADMIN ? '/admin' : '/member'}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
