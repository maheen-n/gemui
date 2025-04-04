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
  Home,
  BookOpen,
  FileText,
  Users2,
  MessageSquare,
  Cog,
  Wallet,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flower2,
  Sparkles,
  Hotel,
  ConciergeBell,
  Utensils,
  Bell,
  Building2,
  ClipboardCheck,
  Receipt,
  Key,
  Mail,
  Phone,
  Star,
  Heart,
  Shield,
  CreditCard,
  FileSpreadsheet,
  Settings2,
  DoorOpen,
  Bath
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

const NavItem = ({ to, icon, label, isActive, isCollapsed, children }: NavItemProps & { children?: NavItem[] }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    if (children) {
      return children.some(child => child.to === location.pathname);
    }
    return false;
  });
  const hasChildren = children && children.length > 0;

  if (hasChildren) {
    const isChildActive = children.some(child => child.to === location.pathname);
    
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full gap-3 px-4 py-2.5 transition-all duration-200 ${
            isChildActive
              ? 'bg-[#1a2236] text-white font-medium'
              : 'text-gray-300 hover:bg-[#1a2236] hover:text-white'
          }`}
          title={isCollapsed ? label : undefined}
        >
          <div className="flex items-center gap-3">
            {icon}
            {!isCollapsed && <span>{label}</span>}
          </div>
          {!isCollapsed && <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        </button>
        {isOpen && !isCollapsed && (
          <div>
            {children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className={`flex items-center gap-3 px-4 py-2.5 pl-11 transition-all duration-200 ${
                  location.pathname === child.to
                    ? 'bg-[#1a2236] text-white font-medium'
                    : 'text-gray-300 hover:bg-[#1a2236] hover:text-white'
                }`}
              >
                <child.icon className="h-5 w-5" />
                <span>{child.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
        isActive
          ? 'bg-[#1a2236] text-white font-medium'
          : 'text-gray-300 hover:bg-[#1a2236] hover:text-white'
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
  children?: NavItem[];
}

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems: NavItem[] = [
    { to: '/dashboard', icon: Hotel, label: 'Home' },
    { to: '/logbook', icon: ClipboardCheck, label: 'Logbook' },
    { to: '/documents', icon: FileText, label: 'Documents' },
    { to: '/collaboration', icon: Users2, label: 'Collaboration' },
    { to: '/guest-management', icon: ConciergeBell, label: 'Guest Management', children: [
      { to: '/room-planning', icon: BedDouble, label: 'Room Planning' },
      { to: '/guest-management/reservations', icon: Calendar, label: 'Reservations' },
      { to: '/guest-management/spa-booking', icon: Sparkles, label: 'Spa Booking' },
      { to: '/guest-profiles', icon: Users, label: 'Guest Profiles' },
      { to: '/loyalty-transactions', icon: CreditCard, label: 'Loyalty Transactions' },
      { to: '/segments', icon: Users2, label: 'Segments' }
    ]},
    { to: '/guest-experience', icon: Star, label: 'Guest Experience' },
    { to: '/operations', icon: Building2, label: 'Operations', children: [
      { to: '/work-orders', icon: Wrench, label: 'Work Orders' },
      { to: '/lost-found', icon: Key, label: 'Lost & Found' },
      { to: '/operations/housekeeping', icon: Bath, label: 'Housekeeping' }
    ]},
    { to: '/quality-compliance', icon: Shield, label: 'Quality & Compliance' },
    { to: '/financials', icon: FileSpreadsheet, label: 'Financials' },
    { to: '/settings', icon: Settings2, label: 'Settings' }
  ];

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      <div 
        className={`hidden md:flex md:flex-col bg-[#151b2c] border-r border-[#1e2841] shadow-lg transition-all duration-300 ${
          isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        <div className={`px-4 py-4 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} border-b border-[#1e2841]`}>
          {!isSidebarCollapsed && <h1 className="text-xl font-bold text-white">Harmony</h1>}
          {isSidebarCollapsed ? (
            <ThemeToggle />
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="text-gray-300 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={<item.icon className="h-5 w-5" />}
              label={item.label}
              isActive={currentPath === item.to}
              isCollapsed={isSidebarCollapsed}
              children={item.children}
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

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 md:h-0 flex items-center justify-between px-4 border-b border-border md:border-0 bg-background">
          <div className="flex items-center gap-4">
            <MobileMenu />
            <h1 className="text-lg font-bold md:hidden">Hotel Harmony</h1>
          </div>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </header>
        
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
