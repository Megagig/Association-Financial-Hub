import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import MemberDashboard from '../member/MemberDashboard';
import { UserRole } from '@/types';

export default function Index() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  // Render appropriate dashboard based on user role
  return user.role === UserRole.ADMIN ? (
    <AdminDashboard />
  ) : (
    <MemberDashboard />
  );
}
