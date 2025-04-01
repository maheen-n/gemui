
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, User, Calendar, Lotus } from 'lucide-react';
import { useState } from 'react';

const Guests = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const guests = [
    { id: 1, name: 'James Wilson', room: '305', checkIn: '2023-10-14', checkOut: '2023-10-18', status: 'checked-in', phone: '+1 (555) 123-4567', email: 'james.wilson@example.com' },
    { id: 2, name: 'Emma Thompson', room: '210', checkIn: '2023-10-15', checkOut: '2023-10-17', status: 'checked-in', phone: '+1 (555) 234-5678', email: 'emma.thompson@example.com' },
    { id: 3, name: 'Michael Brown', room: '412', checkIn: '2023-10-16', checkOut: '2023-10-20', status: 'arriving-today', phone: '+1 (555) 345-6789', email: 'michael.brown@example.com' },
    { id: 4, name: 'Olivia Garcia', room: '118', checkIn: '2023-10-16', checkOut: '2023-10-19', status: 'arriving-today', phone: '+1 (555) 456-7890', email: 'olivia.garcia@example.com' },
    { id: 5, name: 'William Davis', room: '201', checkIn: '2023-10-12', checkOut: '2023-10-16', status: 'departing-today', phone: '+1 (555) 567-8901', email: 'william.davis@example.com' },
    { id: 6, name: 'Sophia Martinez', room: '307', checkIn: '2023-10-13', checkOut: '2023-10-16', status: 'departing-today', phone: '+1 (555) 678-9012', email: 'sophia.martinez@example.com' },
    { id: 7, name: 'Benjamin Johnson', room: '405', checkIn: '2023-10-10', checkOut: '2023-10-15', status: 'checked-out', phone: '+1 (555) 789-0123', email: 'benjamin.johnson@example.com' },
  ];

  const filteredGuests = guests.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    guest.room.includes(searchTerm) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <Badge className="bg-green-500">Checked In</Badge>;
      case 'arriving-today':
        return <Badge className="bg-blue-500">Arriving Today</Badge>;
      case 'departing-today':
        return <Badge className="bg-yellow-500">Departing Today</Badge>;
      case 'checked-out':
        return <Badge variant="outline">Checked Out</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Guest Management</h1>
            <p className="text-muted-foreground">View and manage hotel guests</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Guest
          </Button>
        </div>

        <Tabs defaultValue="guests" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="guests" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Guests
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Reservations
            </TabsTrigger>
            <TabsTrigger value="spa" className="flex items-center">
              <Lotus className="mr-2 h-4 w-4" />
              Spa Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guests">
            <div className="flex items-center mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search guests..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Current Guests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{guest.name}</div>
                            <div className="text-xs text-muted-foreground">{guest.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{guest.room}</TableCell>
                        <TableCell>{guest.checkIn}</TableCell>
                        <TableCell>{guest.checkOut}</TableCell>
                        <TableCell>{getStatusBadge(guest.status)}</TableCell>
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
          </TabsContent>

          <TabsContent value="reservations">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Manage Guest Reservations</h3>
              <Button asChild>
                <Link to="/guest-management/reservations">
                  <Calendar className="mr-2 h-4 w-4" />
                  Go to Reservations
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Manage Reservations</h3>
                  <p className="mt-2 text-muted-foreground">
                    View, create and manage guest reservations and room assignments.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/guest-management/reservations">
                      Go to Reservations
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="spa">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Spa & Wellness Bookings</h3>
              <Button asChild>
                <Link to="/guest-management/spa-booking">
                  <Lotus className="mr-2 h-4 w-4" />
                  Go to Spa Booking
                </Link>
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Lotus className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Manage Spa Bookings</h3>
                  <p className="mt-2 text-muted-foreground">
                    Book and manage spa services for guests. View availability and schedule appointments.
                  </p>
                  <Button className="mt-4" asChild>
                    <Link to="/guest-management/spa-booking">
                      Go to Spa Booking
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Guests;
