import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/public/HomePage';
import SignInPage from './pages/public/SignInPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminLayout from './layouts/AdminLayout';
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage';
import AdminLoansPage from './pages/admin/AdminLoansPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminAccountSettingsPage from './pages/admin/AccountSettingsPage';
import AdminHelpSupportPage from './pages/admin/AdminHelpSupportPage';
import MemberLayout from './layouts/MemberLayout';
import MemberDashboardPage from './pages/member/MemberDashboardPage';
import MemberProfilePage from './pages/member/MemberProfilePage';
import MemberPaymentsPage from './pages/member/MemberPaymentsPage';
import MemberLoansPage from './pages/member/MemberLoansPage';
import MemberReportsPage from './pages/member/MemberReportsPage';
import MemberAccountSettingsPage from './pages/member/MemberAccountSettingsPage';
import MemberHelpSupportPage from './pages/member/MemberHelpSupportPage';
import { useAuth } from './context/AuthContext';
import Register from './pages/public/Register';
// import { UserRole } from './types';

const PrivateRoute: React.FC<{
  element: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'USER')[];
}> = ({ element, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user.role) {
    // Case-insensitive role check
    const userRoleUpperCase = user.role.toUpperCase();
    const hasAllowedRole = allowedRoles.some(
      (role) => role === userRoleUpperCase
    );

    if (!hasAllowedRole) {
      return (
        <Navigate
          to={userRoleUpperCase === 'ADMIN' ? '/admin' : '/member'}
          replace
        />
      );
    }
  }

  return <>{element}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <SignInPage />,
      },
      {
        path: 'admin',
        element: (
          <PrivateRoute allowedRoles={['ADMIN']} element={<AdminLayout />} />
        ),
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            path: 'payments',
            element: <AdminPaymentsPage />,
          },
          {
            path: 'loans',
            element: <AdminLoansPage />,
          },
          {
            path: 'reports',
            element: <AdminReportsPage />,
          },
          {
            path: 'account-settings',
            element: <AdminAccountSettingsPage />,
          },
          {
            path: 'help-support',
            element: <AdminHelpSupportPage />,
          },
        ],
      },
      {
        path: 'member',
        element: (
          <PrivateRoute allowedRoles={['USER']} element={<MemberLayout />} />
        ),
        children: [
          {
            index: true,
            element: <MemberDashboardPage />,
          },
          {
            path: 'profile',
            element: <MemberProfilePage />,
          },
          {
            path: 'payments',
            element: <MemberPaymentsPage />,
          },
          {
            path: 'loans',
            element: <MemberLoansPage />,
          },
          {
            path: 'reports',
            element: <MemberReportsPage />,
          },
          {
            path: 'account-settings',
            element: <MemberAccountSettingsPage />,
          },
          {
            path: 'help-support',
            element: <MemberHelpSupportPage />,
          },
        ],
      },
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
