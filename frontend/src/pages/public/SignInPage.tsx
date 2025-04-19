import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/Auth/LoginForm';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export default function SignInPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      const redirectPath = user.role === UserRole.ADMIN ? '/admin' : '/member';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-bright">
            Alumni Financial Hub
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your alumni membership, dues, and financial services
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
