
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BedDouble,
  Users,
  ClipboardList,
  ShoppingBag,
  Coins,
  TrendingUp,
  Percent
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Progress } from '@/components/ui/progress';

const statCards = [
  {
    title: 'Available Rooms',
    value: '24',
    description: 'Out of 40 total rooms',
    icon: <BedDouble className="h-8 w-8 text-primary" />,
    color: 'bg-primary/10'
  },
  {
    title: 'Current Guests',
    value: '42',
    description: '8 check-ins today',
    icon: <Users className="h-8 w-8 text-indigo-500" />,
    color: 'bg-indigo-500/10'
  },
  {
    title: 'Open Tasks',
    value: '13',
    description: '5 high priority',
    icon: <ClipboardList className="h-8 w-8 text-yellow-500" />,
    color: 'bg-yellow-500/10'
  },
  {
    title: 'Lost Items',
    value: '7',
    description: '3 reported today',
    icon: <ShoppingBag className="h-8 w-8 text-red-500" />,
    color: 'bg-red-500/10'
  }
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>{card.icon}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground border rounded-md">
                Revenue chart would appear here
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate</CardTitle>
              <CardDescription>Current hotel occupancy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-4xl font-bold text-center flex items-center">
                  65% <Percent className="h-6 w-6 ml-1 text-muted-foreground" />
                </div>
                <Progress value={65} className="h-2 w-full" />
                <p className="text-sm text-muted-foreground">16 rooms occupied out of 40</p>
              </div>
              
              <div className="space-y-2">
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
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  { title: 'Clean room 304', priority: 'high', assigned: 'Maria Lopez' },
                  { title: 'Restock mini bar in room 210', priority: 'medium', assigned: 'John Smith' },
                  { title: 'Fix AC in room 115', priority: 'high', assigned: 'Robert Chen' },
                  { title: 'Replace towels in room 402', priority: 'low', assigned: 'Sarah Johnson' },
                ].map((task, i) => (
                  <li key={i} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">Assigned to: {task.assigned}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Check-ins</CardTitle>
              <CardDescription>Expected arrivals today</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  { name: 'James Wilson', room: '305', time: '14:00', status: 'confirmed' },
                  { name: 'Emma Thompson', room: '210', time: '15:30', status: 'pending' },
                  { name: 'Michael Brown', room: '412', time: '16:00', status: 'confirmed' },
                  { name: 'Olivia Garcia', room: '118', time: '18:30', status: 'confirmed' },
                ].map((checkin, i) => (
                  <li key={i} className="flex items-center justify-between p-2 border rounded-md">
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
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
