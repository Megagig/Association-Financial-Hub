import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardHeader } from '../components/Dashboard/DashboardHeader';
import { DashboardSidebar } from '../components/Dashboard/DashboardSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '../components/ui/button';

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
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardSidebar items={memberNavItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
