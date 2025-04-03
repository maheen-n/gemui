
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
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
  ChevronDown,
  Sparkles,
  Hotel,
  ConciergeBell,
  Building2,
  ClipboardCheck,
  Key,
  Star,
  Shield,
  CreditCard,
  FileSpreadsheet,
  Settings2,
  Plane
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Link } from 'react-router-dom';

interface NavItem {
  to: string;
  icon: any;
  label: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: Hotel, label: 'Home' },
  { to: '/logbook', icon: ClipboardCheck, label: 'Logbook' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/collaboration', icon: Users2, label: 'Collaboration' },
  { to: '/guest-management', icon: ConciergeBell, label: 'Guest Management', children: [
    { to: '/room-planning', icon: BedDouble, label: 'Room Planning' },
    { to: '/guest-management/reservations', icon: Plane, label: 'Arrivals' },
    { to: '/guest-management/spa-booking', icon: Sparkles, label: 'Spa Booking' },
    { to: '/guest-profiles', icon: Users, label: 'Guest Profiles' },
    { to: '/loyalty-transactions', icon: CreditCard, label: 'Loyalty Transactions' },
    { to: '/segments', icon: Users2, label: 'Segments' }
  ]},
  { to: '/guest-experience', icon: Star, label: 'Guest Experience' },
  { to: '/operations', icon: Building2, label: 'Operations', children: [
    { to: '/work-orders', icon: Wrench, label: 'Work Orders' },
    { to: '/lost-found', icon: Key, label: 'Lost & Found' }
  ]},
  { to: '/quality-compliance', icon: Shield, label: 'Quality & Compliance' },
  { to: '/financials', icon: FileSpreadsheet, label: 'Financials' },
  { to: '/settings', icon: Settings2, label: 'Settings' }
];

const NavLink = ({ item, currentPath, onClick }: { item: NavItem; currentPath: string; onClick: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(() => {
    if (item.children) {
      return item.children.some(child => child.to === currentPath);
    }
    return false;
  });
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    const isChildActive = item.children.some(child => child.to === currentPath);
    
    return (
      <div>
        <button
          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 transition-colors ${
            isChildActive
              ? 'bg-[#1a2236] text-white font-medium'
              : 'text-gray-300 hover:bg-[#1a2236] hover:text-white'
          }`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div>
            {item.children.map((child) => (
              <Link
                key={child.to}
                to={child.to}
                className={`flex items-center gap-3 px-4 py-2.5 pl-11 transition-colors ${
                  currentPath === child.to
                    ? 'bg-[#1a2236] text-white font-medium'
                    : 'text-gray-300 hover:bg-[#1a2236] hover:text-white'
                }`}
                onClick={onClick}
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
      to={item.to}
      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
        currentPath === item.to
          ? 'bg-[#1a2236] text-white font-medium'
          : 'text-gray-300 hover:bg-[#1a2236] hover:text-white'
      }`}
      onClick={onClick}
    >
      <item.icon className="h-5 w-5" />
      <span>{item.label}</span>
    </Link>
  );
};

export function MobileMenu() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] p-0 bg-[#151b2c] text-white">
        <div className="flex flex-col h-full">
          <div className="px-4 py-4 flex items-center justify-between border-b border-[#1e2841]">
            <h1 className="text-xl font-bold text-white">Hotel Harmony</h1>
            <ThemeToggle />
          </div>
          
          <div className="flex-1 overflow-auto py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                item={item}
                currentPath={currentPath}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
          
          <div className="p-4 border-t border-[#1e2841]">
            <Link
              to="/logout"
              className="flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors text-gray-300 hover:bg-[#1a2236] hover:text-white"
              onClick={() => setOpen(false)}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
