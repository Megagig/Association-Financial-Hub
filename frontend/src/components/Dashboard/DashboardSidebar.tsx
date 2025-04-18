import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

import {
  Users,
  LayoutDashboard,
  CreditCard,
  CircleDollarSign,
  Settings,
  BadgeHelp,
  User,
  BarChart,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void; // Optional callback for mobile to close sidebar on navigation
}

export function DashboardSidebar({ className, onNavigate }: SidebarProps) {
  const { isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Helper to handle navigation and potential sidebar closing
  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div
      className={cn('pb-12 border-r bg-card h-full overflow-y-auto', className)}
    >
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <div className="space-y-1">
            <Link
              to="/"
              onClick={handleNavClick}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive('/')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>

            {isAdmin ? (
              <>
                <Link
                  to="/members"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/members')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </Link>
                <Link
                  to="/payments"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/payments')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payments
                </Link>
                <Link
                  to="/loans"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/loans')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <CircleDollarSign className="h-4 w-4 mr-2" />
                  Loans
                </Link>
                <Link
                  to="/reports"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/reports')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/profile')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Link>
                <Link
                  to="/my-payments"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/my-payments')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  My Payments
                </Link>
                <Link
                  to="/my-loans"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/my-loans')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <CircleDollarSign className="h-4 w-4 mr-2" />
                  My Loans
                </Link>
                <Link
                  to="/reports"
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive('/reports')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Link
              to="/settings"
              onClick={handleNavClick}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive('/settings')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </Link>
            <Link
              to="/help"
              onClick={handleNavClick}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive('/help')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <BadgeHelp className="h-4 w-4 mr-2" />
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
