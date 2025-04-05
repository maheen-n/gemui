
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  BedDouble,
  Users,
  ClipboardList,
  ShoppingBag,
  Coins,
  TrendingUp,
  Percent,
  Filter,
  CalendarRange,
  CheckCircle,
  AlertCircle,
  BellRing,
  FileText,
  Settings,
  X,
  Maximize2,
  Minimize2,
  ChevronsUpDown
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Progress } from '@/components/ui/progress';

// Widget Configuration Types
interface Widget {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  component: React.ReactNode;
  size: 'small' | 'medium' | 'large';
}

const Dashboard = () => {
  // Get user name (in a real app, this would come from auth)
  const userName = "Radhakrishna Shenoi";
  
  // Widget enabled states
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'workOrders',
      title: 'Work Orders',
      description: 'Pending maintenance requests',
      icon: <Wrench className="h-6 w-6 text-indigo-500" />,
      enabled: true,
      size: 'medium',
      component: <WorkOrdersWidget />
    },
    {
      id: 'approvals',
      title: 'My Approvals',
      description: 'Documents and proposals needing your approval',
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      enabled: true,
      size: 'medium',
      component: <ApprovalsWidget />
    },
    {
      id: 'tasks',
      title: 'My Tasks',
      description: 'Open tasks assigned to you',
      icon: <ClipboardList className="h-6 w-6 text-yellow-500" />,
      enabled: true,
      size: 'medium',
      component: <TasksWidget />
    },
    {
      id: 'issues',
      title: 'Issues',
      description: 'Issues reported to you',
      icon: <AlertCircle className="h-6 w-6 text-red-500" />,
      enabled: true,
      size: 'medium',
      component: <IssuesWidget />
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Organization-wide announcements',
      icon: <BellRing className="h-6 w-6 text-purple-500" />,
      enabled: true,
      size: 'large',
      component: <AnnouncementsWidget />
    },
    {
      id: 'occupancy',
      title: 'Occupancy',
      description: 'Current hotel occupancy',
      icon: <BedDouble className="h-6 w-6 text-green-500" />,
      enabled: true,
      size: 'small',
      component: <OccupancyWidget />
    },
    {
      id: 'checkIns',
      title: 'Check-ins',
      description: "Today's arrivals",
      icon: <Users className="h-6 w-6 text-sky-500" />,
      enabled: true,
      size: 'small',
      component: <CheckInsWidget />
    }
  ]);
  
  const [isWidgetDialogOpen, setIsWidgetDialogOpen] = useState(false);
  
  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? {...widget, enabled: !widget.enabled} : widget
    ));
  };
  
  const updateWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(widgets.map(widget => 
      widget.id === id ? {...widget, size} : widget
    ));
  };
  
  // Filter only enabled widgets
  const enabledWidgets = widgets.filter(widget => widget.enabled);
  
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsWidgetDialogOpen(true)}
            className="mt-4 md:mt-0"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Widgets
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {enabledWidgets
            .filter(widget => widget.size === 'small')
            .map(widget => (
              <WidgetWrapper 
                key={widget.id} 
                widget={widget} 
                updateSize={updateWidgetSize}
              />
            ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enabledWidgets
            .filter(widget => widget.size === 'medium')
            .map(widget => (
              <WidgetWrapper 
                key={widget.id} 
                widget={widget}
                updateSize={updateWidgetSize}
              />
            ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {enabledWidgets
            .filter(widget => widget.size === 'large')
            .map(widget => (
              <WidgetWrapper 
                key={widget.id} 
                widget={widget}
                updateSize={updateWidgetSize}
              />
            ))}
        </div>
        
        {/* Widget Manager Dialog */}
        <Dialog open={isWidgetDialogOpen} onOpenChange={setIsWidgetDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Manage Your Widgets</DialogTitle>
              <DialogDescription>
                Enable or disable dashboard widgets to customize your view.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
              {widgets.map(widget => (
                <div key={widget.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-primary/10">{widget.icon}</div>
                    <div>
                      <h4 className="font-semibold">{widget.title}</h4>
                      <p className="text-sm text-muted-foreground">{widget.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={widget.enabled}
                    onCheckedChange={() => toggleWidget(widget.id)}
                    id={`widget-${widget.id}`}
                  />
                </div>
              ))}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setIsWidgetDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

// Widget Wrapper Component
interface WidgetWrapperProps {
  widget: Widget;
  updateSize: (id: string, size: 'small' | 'medium' | 'large') => void;
}

const WidgetWrapper = ({ widget, updateSize }: WidgetWrapperProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleSizeChange = () => {
    const sizeMap: Record<string, 'small' | 'medium' | 'large'> = {
      'small': 'medium',
      'medium': 'large',
      'large': 'small'
    };
    
    updateSize(widget.id, sizeMap[widget.size]);
  };
  
  return (
    <Card className="transition-all duration-300 shadow-sm hover:shadow-md border-border/40">
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center space-y-0">
        <div className="flex items-center space-x-2">
          {widget.icon}
          <CardTitle className="text-lg">{widget.title}</CardTitle>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={handleSizeChange} title="Change size">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {widget.component}
      </CardContent>
    </Card>
  );
};

// Individual Widget Components
const WorkOrdersWidget = () => {
  return (
    <Tabs defaultValue="open">
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="new">New</TabsTrigger>
        <TabsTrigger value="open">Open</TabsTrigger>
        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        <TabsTrigger value="done">Done</TabsTrigger>
      </TabsList>
      
      <TabsContent value="new" className="space-y-4">
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">Repair broken AC in Room 302</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Requested by: Guest</p>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="open" className="space-y-4">
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">Fix door lock in Room 215</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Open</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Assigned to: Robert Chen</p>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="in-progress">
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">Replace light bulbs in Room 118</span>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">In Progress</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Started: 2 hours ago</p>
            </div>
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="done">
        <div className="text-center py-8 text-muted-foreground">
          No work orders completed today
        </div>
      </TabsContent>
    </Tabs>
  );
};

const ApprovalsWidget = () => {
  return (
    <Tabs defaultValue="documents">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="proposals">Proposals</TabsTrigger>
      </TabsList>
      
      <TabsContent value="documents" className="space-y-2">
        {['Product Development Goals - F&B #89', 'AC Warranty Paper', 'Unit segments for Rooms'].map((doc, i) => (
          <div key={i} className="p-3 border rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">{doc}</span>
              <span className="text-xs text-muted-foreground">KRA</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-muted-foreground">Bijoys George</span>
              <span className="text-xs text-muted-foreground">Feb 21, 2025</span>
            </div>
          </div>
        ))}
      </TabsContent>
      
      <TabsContent value="proposals" className="space-y-2">
        {['Room Service Menu Update', 'Lobby Renovation Plan'].map((proposal, i) => (
          <div key={i} className="p-3 border rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">{proposal}</span>
              <span className="text-xs text-muted-foreground">Proposal</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-muted-foreground">George Joseph</span>
              <span className="text-xs text-muted-foreground">Nov 18, 2023</span>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};

const TasksWidget = () => {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Due Today</span>
          <Badge variant="outline" className="bg-red-100 text-red-800">3</Badge>
        </div>
        <div className="space-y-2">
          {['Review staff schedules', 'Approve inventory orders', 'Call maintenance vendor'].map((task, i) => (
            <div key={i} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">{task}</span>
                <Badge variant="outline" className={`${i === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {i === 0 ? 'High' : 'Medium'}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">Due at 5:00 PM</span>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Upcoming</span>
        </div>
        <div className="space-y-2">
          {['Prepare monthly report', 'Staff meeting'].map((task, i) => (
            <div key={i} className="p-3 border rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">{task}</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>
              </div>
              <span className="text-xs text-muted-foreground">Due tomorrow</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const IssuesWidget = () => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {[
          { title: 'Guest complaint about noise', reporter: 'Front Desk', time: '1 hour ago', priority: 'high' },
          { title: 'Wi-Fi not working in Room 405', reporter: 'Guest', time: '3 hours ago', priority: 'medium' },
          { title: 'Billing discrepancy', reporter: 'Accounting', time: '5 hours ago', priority: 'medium' },
        ].map((issue, i) => (
          <div key={i} className="p-3 border rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">{issue.title}</span>
              <Badge variant={issue.priority === 'high' ? 'destructive' : 'outline'} className={issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}>
                {issue.priority === 'high' ? 'High' : 'Medium'}
              </Badge>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-sm text-muted-foreground">Reported by: {issue.reporter}</span>
              <span className="text-xs text-muted-foreground">{issue.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button variant="outline" size="sm">View All Issues</Button>
      </div>
    </div>
  );
};

const AnnouncementsWidget = () => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-primary/5 rounded-lg border">
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <BellRing className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Annual Meeting: Strategic Planning</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Join us for the annual strategic planning meeting on April 15th. All department heads are required to attend and present their goals for the upcoming year.
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">From: Management Team</span>
              <span className="text-xs text-muted-foreground">Posted: 2 days ago</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
            <Bell className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h4 className="font-semibold">System Maintenance Notice</h4>
            <p className="text-sm text-muted-foreground mt-1">
              The hotel management system will be down for maintenance from 2 AM to 4 AM on April 10th. Please plan accordingly.
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">From: IT Department</span>
              <span className="text-xs text-muted-foreground">Posted: Yesterday</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <h4 className="font-semibold">New Booking Protocol</h4>
            <p className="text-sm text-muted-foreground mt-1">
              Starting next week, all special requests from VIP guests need to be approved by the general manager or duty manager. Please update your procedures.
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">From: Operations Manager</span>
              <span className="text-xs text-muted-foreground">Posted: Today</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button variant="outline" size="sm">View All Announcements</Button>
      </div>
    </div>
  );
};

const OccupancyWidget = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="text-4xl font-bold text-center flex items-center">
        65% <Percent className="h-6 w-6 ml-1 text-muted-foreground" />
      </div>
      <Progress value={65} className="h-2 w-full" />
      <p className="text-sm text-muted-foreground text-center">26 rooms occupied out of 40</p>
      
      <div className="w-full space-y-1 mt-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Average Daily Rate</span>
          <span className="font-medium flex items-center">
            $120 <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Revenue per Room</span>
          <span className="font-medium flex items-center">
            $78 <Coins className="h-4 w-4 ml-1 text-primary" />
          </span>
        </div>
      </div>
    </div>
  );
};

const CheckInsWidget = () => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Today's Arrivals</span>
        <Badge variant="outline" className="bg-green-100 text-green-800">8 Guests</Badge>
      </div>
      
      <div className="space-y-2 max-h-[180px] overflow-y-auto">
        {[
          { name: 'James Wilson', room: '305', time: '14:00', status: 'confirmed' },
          { name: 'Emma Thompson', room: '210', time: '15:30', status: 'pending' },
          { name: 'Michael Brown', room: '412', time: '16:00', status: 'confirmed' },
          { name: 'Olivia Garcia', room: '118', time: '18:30', status: 'confirmed' },
        ].map((checkin, i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded-md">
            <div>
              <p className="font-medium">{checkin.name}</p>
              <p className="text-xs text-muted-foreground">Room {checkin.room} at {checkin.time}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              checkin.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {checkin.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
