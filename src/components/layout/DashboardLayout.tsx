
import React, { useState } from 'react';
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
  CalendarRange,
  LucideIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavItem = ({ to, icon, label, isActive, isCollapsed }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1'
      }`}
      title={isCollapsed ? label : undefined}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems: NavItem[] = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/rooms', icon: BedDouble, label: 'Rooms' },
    { to: '/room-planning', icon: CalendarRange, label: 'Room Planning' },
    { to: '/tasks', icon: ClipboardList, label: 'Tasks' },
    { to: '/work-orders', icon: Wrench, label: 'Work Orders' },
    { to: '/lost-found', icon: ShoppingBag, label: 'Lost & Found' },
    { to: '/guests', icon: User, label: 'Guests' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/staff', icon: Users, label: 'Staff' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div 
        className={`hidden md:flex md:flex-col bg-sidebar border-r border-sidebar-border shadow-lg transition-all duration-300 ${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        <div className={`px-4 py-6 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} border-b border-sidebar-border`}>
          {!isSidebarCollapsed && <h1 className="text-xl font-bold text-sidebar-foreground">Hotel Harmony</h1>}
          {isSidebarCollapsed ? (
            <ThemeToggle />
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="text-sidebar-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={<item.icon className="h-5 w-5" />}
              label={item.label}
              isActive={currentPath === item.to}
              isCollapsed={isSidebarCollapsed}
            />
          ))}
        </div>

        {!isSidebarCollapsed ? (
          <div className="p-4 border-t border-sidebar-border">
            <NavItem
              to="/logout"
              icon={<LogOut className="h-5 w-5" />}
              label="Logout"
              isActive={false}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        ) : (
          <div className="p-4 border-t border-sidebar-border flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-sidebar-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 md:h-0 flex items-center justify-between px-4 border-b border-border md:border-0 bg-background">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <h1 className="text-lg font-bold md:hidden">Hotel Harmony</h1>
          </div>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
