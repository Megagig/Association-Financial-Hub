import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import {
  DollarSign,
  HelpCircle,
  LucideIcon,
  Settings,
  UserCircle,
  UserCog,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
  links: Array<{
    to: string;
    label: string;
    end?: boolean;
    icon?: LucideIcon;
  }>;
}

export function DashboardSidebar({ className, onNavigate }: SidebarProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin';

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
    ...(isSuperAdmin
      ? [
          {
            to: '/admin/admin-management',
            label: 'Admin Management',
            icon: UserCog,
          },
        ]
      : []),
  ].filter(Boolean);

  const memberLinks = [
    { to: '/member', label: 'Dashboard', end: true },
    { to: '/member/profile', label: 'Profile' },
    { to: '/member/my-payments', label: 'My Payments' },
    { to: '/member/my-loans', label: 'My Loans' },
    { to: '/member/reports', label: 'Reports' },
    { to: '/member/settings', icon: Settings, label: 'Settings' },
    { to: '/member/help-support', icon: HelpCircle, label: 'Help & Support' },
  ];

  // Use the correct links based on user role
  const navigationLinks = isAdmin ? adminLinks : memberLinks;

  return (
    <div className={cn('pb-12 border-r bg-card h-full', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationLinks.map((link) => (
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
                {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
