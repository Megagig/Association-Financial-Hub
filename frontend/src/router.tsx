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
import AdminDashboard from './pages/admin/AdminDashboardPage';
import MembersPage from './pages/admin/MembersPage';
import PaymentsPage from './pages/admin/AdminPaymentsPage';
import LoansPage from './pages/admin/AdminLoansPage';
import ReportsPage from './pages/admin/AdminReportsPage';

// Import member pages
import MemberDashboard from './pages/member/MemberDashboardPage';
import ProfilePage from './pages/member/MemberProfilePage';
import MyPaymentsPage from './pages/member/MemberPaymentsPage';
import MyLoansPage from './pages/member/MemberLoansPage';
import MyReportsPage from './pages/member/MemberReportsPage';

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
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'loans', element: <LoansPage /> },
      { path: 'reports', element: <ReportsPage /> },
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
      { path: 'profile', element: <ProfilePage /> },
      { path: 'my-payments', element: <MyPaymentsPage /> },
      { path: 'my-loans', element: <MyLoansPage /> },
      { path: 'reports', element: <MyReportsPage /> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
