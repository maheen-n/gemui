
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
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Link } from 'react-router-dom';

const navItems = [
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
      <SheetContent side="left" className="w-[80%] p-0 bg-sidebar text-sidebar-foreground">
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 flex items-center justify-between border-b border-sidebar-border">
            <h1 className="text-xl font-bold text-sidebar-foreground">Hotel Harmony</h1>
            <ThemeToggle />
          </div>
          
          <div className="flex-1 overflow-auto py-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  currentPath === item.to
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="p-4 border-t border-sidebar-border">
            <Link
              to="/logout"
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent/50"
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
