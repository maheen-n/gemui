
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  BedDouble,
  ClipboardList, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  User,
  Wrench,
  ShoppingBag,
  LucideIcon
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems: NavItem[] = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/rooms', icon: BedDouble, label: 'Rooms' },
    { to: '/tasks', icon: ClipboardList, label: 'Tasks' },
    { to: '/work-orders', icon: Wrench, label: 'Work Orders' },
    { to: '/lost-found', icon: ShoppingBag, label: 'Lost & Found' },
    { to: '/guests', icon: User, label: 'Guests' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/staff', icon: Users, label: 'Staff' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
        <div className="px-4 py-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-sidebar-foreground">Hotel Harmony</h1>
          <ThemeToggle />
        </div>

        <div className="flex-1 px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={<item.icon className="h-5 w-5" />}
              label={item.label}
              isActive={currentPath === item.to}
            />
          ))}
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <NavItem
            to="/logout"
            icon={<LogOut className="h-5 w-5" />}
            label="Logout"
            isActive={false}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
