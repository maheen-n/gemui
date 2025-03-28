
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, PlusCircle } from 'lucide-react';

const Events = () => {
  const events = [
    { id: 1, name: 'Johnson Wedding', venue: 'Grand Ballroom', date: '2023-10-18', time: '16:00 - 22:00', attendees: 120, status: 'upcoming' },
    { id: 2, name: 'Tech Conference', venue: 'Meeting Room A', date: '2023-10-16', time: '09:00 - 17:00', attendees: 45, status: 'today' },
    { id: 3, name: 'Smith Anniversary', venue: 'Garden Terrace', date: '2023-10-20', time: '18:00 - 23:00', attendees: 60, status: 'upcoming' },
    { id: 4, name: 'Corporate Retreat', venue: 'Conference Center', date: '2023-10-22', time: '09:00 - 16:00', attendees: 80, status: 'upcoming' },
    { id: 5, name: 'Charity Gala', venue: 'Grand Ballroom', date: '2023-10-15', time: '19:00 - 23:00', attendees: 150, status: 'completed' },
    { id: 6, name: 'Family Reunion', venue: 'Pool Deck', date: '2023-10-16', time: '12:00 - 16:00', attendees: 35, status: 'today' },
    { id: 7, name: 'Business Meeting', venue: 'Meeting Room B', date: '2023-10-14', time: '10:00 - 12:00', attendees: 15, status: 'completed' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'today':
        return <Badge className="bg-green-500">Today</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Events Calendar</h1>
            <p className="text-muted-foreground">Manage hotel events and bookings</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule Event
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.name}</div>
                            <div className="text-xs text-muted-foreground">{event.attendees} attendees</div>
                          </div>
                        </TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>
                          <div>
                            <div>{event.date}</div>
                            <div className="text-xs text-muted-foreground">{event.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:row-span-2">
            <CardHeader>
              <CardTitle>Today's Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.filter(event => event.status === 'today').map((event) => (
                  <div key={event.id} className="border rounded-md p-4">
                    <h3 className="font-medium">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.venue}</p>
                    <div className="text-sm mt-2">{event.time}</div>
                    <div className="text-sm text-muted-foreground">{event.attendees} attendees</div>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="w-full">Details</Button>
                    </div>
                  </div>
                ))}
                {events.filter(event => event.status === 'today').length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No events scheduled for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Events;
