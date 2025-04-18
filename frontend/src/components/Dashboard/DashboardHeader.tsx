import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/';
import { useAuth } from '../../context/AuthContext';
import { Bell, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <span className="hidden font-bold sm:inline-block text-xl text-blue-bright">
              Alumni Financial Hub
            </span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden md:block">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground">{user.role}</div>
            </div>
            <Avatar>
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              )}
            </Avatar>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
