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
    <DashboardSidebar
      className="hidden md:block w-64 shrink-0"
      links={memberNavItems.map((item) => ({
        to: item.path,
        label: item.label,
        end: item.path === '/member',
      }))}
    />
  );
};

export default MemberLayout;
