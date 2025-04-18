import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { DashboardSidebar } from '../components/Dashboard/DashboardSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar className="hidden md:block w-64 shrink-0" />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
