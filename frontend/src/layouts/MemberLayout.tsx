import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '@/components/Dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/Dashboard/DashboardSidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const memberNavItems = [
  { path: '/member', label: 'Dashboard' },
  { path: '/member/profile', label: 'Profile' },
  { path: '/member/my-payments', label: 'My Payments' },
  { path: '/member/my-loans', label: 'My Loans' },
  { path: '/member/reports', label: 'Reports' },
  { path: '/member/settings', label: 'Settings' },
  { path: '/member/help-support', label: 'Help & Support' },
];

const MemberLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Mobile sidebar toggle button */}
      <div className="md:hidden px-4 py-2 flex items-center border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="ml-2 font-medium">Dashboard Menu</span>
      </div>

      <div className="flex flex-1">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar for mobile */}
        <div
          className={`
            fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:hidden
          `}
        >
          <DashboardSidebar
            className="h-full"
            onNavigate={handleNavigation}
            links={memberNavItems.map((item) => ({
              to: item.path,
              label: item.label,
              end: item.path === '/member',
            }))}
          />
        </div>

        {/* Desktop sidebar - always visible */}
        <DashboardSidebar
          className="hidden md:block w-64 shrink-0"
          links={memberNavItems.map((item) => ({
            to: item.path,
            label: item.label,
            end: item.path === '/member',
          }))}
        />

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
