
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BedDouble,
  Filter,
  PlusCircle,
  Search,
} from 'lucide-react';
import { Room } from '@/types';

// Mock data
const initialRooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'Standard',
    status: 'available',
    floor: 1,
    capacity: 2,
    rate: 99,
    amenities: ['TV', 'WiFi', 'Air Conditioning'],
    lastCleaned: '2023-10-15T10:30:00Z',
  },
  {
    id: '2',
    number: '102',
    type: 'Standard',
    status: 'occupied',
    floor: 1,
    capacity: 2,
    rate: 99,
    amenities: ['TV', 'WiFi', 'Air Conditioning'],
    lastCleaned: '2023-10-14T11:00:00Z',
  },
  {
    id: '3',
    number: '201',
    type: 'Deluxe',
    status: 'available',
    floor: 2,
    capacity: 3,
    rate: 149,
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View'],
    lastCleaned: '2023-10-15T09:15:00Z',
  },
  {
    id: '4',
    number: '202',
    type: 'Deluxe',
    status: 'maintenance',
    floor: 2,
    capacity: 3,
    rate: 149,
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View'],
  },
  {
    id: '5',
    number: '301',
    type: 'Suite',
    status: 'available',
    floor: 3,
    capacity: 4,
    rate: 249,
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Balcony', 'Jacuzzi'],
    lastCleaned: '2023-10-15T08:30:00Z',
  },
  {
    id: '6',
    number: '302',
    type: 'Suite',
    status: 'cleaning',
    floor: 3,
    capacity: 4,
    rate: 249,
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Balcony', 'Jacuzzi'],
  },
  {
    id: '7',
    number: '401',
    type: 'Presidential Suite',
    status: 'occupied',
    floor: 4,
    capacity: 6,
    rate: 499,
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Balcony', 'Jacuzzi', 'Sauna', 'Kitchen'],
    lastCleaned: '2023-10-14T13:00:00Z',
  },
];

const roomTypeCards = [
  { type: 'Standard', count: 10, available: 5, amenities: ['TV', 'WiFi', 'Air Conditioning'], rate: '$99' },
  { type: 'Deluxe', count: 8, available: 3, amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View'], rate: '$149' },
  { type: 'Suite', count: 5, available: 2, amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Balcony', 'Jacuzzi'], rate: '$249' },
  { type: 'Presidential Suite', count: 2, available: 1, amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Ocean View', 'Balcony', 'Jacuzzi', 'Sauna', 'Kitchen'], rate: '$499' },
];

const Rooms = () => {
  const [rooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.includes(searchTerm) || 
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-500">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-500">Maintenance</Badge>;
      case 'cleaning':
        return <Badge className="bg-yellow-500">Cleaning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Rooms Management</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Room
          </Button>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="types">Room Types</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search rooms..." 
                  className="pl-8" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead className="hidden md:table-cell">Capacity</TableHead>
                      <TableHead className="hidden md:table-cell">Rate</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Cleaned</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium">{room.number}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>{getStatusBadge(room.status)}</TableCell>
                        <TableCell>{room.floor}</TableCell>
                        <TableCell className="hidden md:table-cell">{room.capacity}</TableCell>
                        <TableCell className="hidden md:table-cell">${room.rate}</TableCell>
                        <TableCell className="hidden lg:table-cell">{room.lastCleaned ? new Date(room.lastCleaned).toLocaleDateString() : '-'}</TableCell>
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

          <TabsContent value="types" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {roomTypeCards.map((roomType, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BedDouble className="mr-2 h-5 w-5" />
                      {roomType.type}
                    </CardTitle>
                    <CardDescription>
                      {roomType.available} available out of {roomType.count} total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-medium">{roomType.rate} / night</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Amenities:</span>
                        <div className="flex flex-wrap gap-1">
                          {roomType.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="bg-accent">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Rooms</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
