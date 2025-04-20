import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { DollarSign, HelpCircle, Settings, UserCircle } from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function DashboardSidebar({ className, onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/profile', label: 'Profile', icon: UserCircle },
    { to: '/admin/members', label: 'Members' },
    { to: '/admin/payments', label: 'Payments' },
    { to: '/admin/loans', label: 'Loans' },
    { to: '/admin/reports', label: 'Reports' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
    { to: '/admin/help-support', icon: HelpCircle, label: 'Help & Support' },
    {
      to: '/admin/income-expenses',
      icon: DollarSign,
      label: 'Income & Expenses',
    },
  ];

  const memberLinks = [
    { to: '/member', label: 'Dashboard', end: true },
    { to: '/member/profile', label: 'Profile' },
    { to: '/member/my-payments', label: 'My Payments' },
    { to: '/member/my-loans', label: 'My Loans' },
    { to: '/member/reports', label: 'Reports' },
    { to: '/member/settings', icon: Settings, label: 'Settings' },
    { to: '/member/help-support', icon: HelpCircle, label: 'Help & Support' },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <div className={cn('pb-12 border-r bg-card h-full', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center py-2 px-3 rounded-md text-sm font-medium',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )
                }
                onClick={onNavigate}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
