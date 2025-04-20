import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';
import PrivateRoute from './components/Routes/PrivateRoute';
import HomePage from './pages/public/HomePage';
import SignInPage from './pages/public/SignInPage';
import Register from './pages/public/Register';
import { UserRole } from './types';

// Import admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import MembersPage from './pages/admin/MembersPage';
import AdminProfilePage from './pages/admin/AdminProfilePage'; // Use this import
import PaymentsPage from './pages/admin/PaymentsPage';
import LoansPage from './pages/admin/LoansPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import HelpSupportPage from './pages/admin/HelpSupportPage';
import IncomeExpensesPage from './pages/admin/IncomeExpensesPage';

// Import member pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberProfilePage from './pages/member/MemberProfilePage'; // Use this import
import MyPaymentsPage from './pages/member/MyPaymentsPage';
import MyLoansPage from './pages/member/MyLoansPage';
import MyReportsPage from './pages/member/MyReportsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <SignInPage /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute allowedRoles={[UserRole.ADMIN]}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'members', element: <MembersPage /> },
      { path: 'profile', element: <AdminProfilePage /> }, // Keep only this profile route
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'loans', element: <LoansPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'help-support', element: <HelpSupportPage /> },
      { path: 'income-expenses', element: <IncomeExpensesPage /> },
    ],
  },
  {
    path: '/member',
    element: (
      <PrivateRoute allowedRoles={[UserRole.USER]}>
        <MemberLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <MemberDashboard /> },
      { path: 'profile', element: <MemberProfilePage /> }, // Use MemberProfilePage
      { path: 'my-payments', element: <MyPaymentsPage /> },
      { path: 'my-loans', element: <MyLoansPage /> },
      { path: 'reports', element: <MyReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'help-support', element: <HelpSupportPage /> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
