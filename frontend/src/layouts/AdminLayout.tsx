import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { DashboardSidebar } from '../components/Dashboard/DashboardSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking links (for mobile)
  const handleNavigation = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when screen size changes to desktop
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
      <DashboardHeader />

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

      <div className="flex flex-1 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar - sliding from left */}
        <div
          className={`
          fixed inset-y-0 left-0 z-30 w-64 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden transition-transform duration-200 ease-in-out
        `}
        >
          <div className="h-full flex flex-col bg-card">
            <div className="p-4 flex justify-between items-center border-b">
              <span className="font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <DashboardSidebar
              className="flex-1"
              onNavigate={handleNavigation}
              links={[]}
            />
          </div>
        </div>

        {/* Desktop sidebar - always visible on md+ screens */}
        <DashboardSidebar
          className="hidden md:block w-64 shrink-0"
          links={[]}
        />

        {/* Main content area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
