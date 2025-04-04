
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AmenityLog } from '@/types';
import { Calendar, Search } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Mock data
const amenityLogs: AmenityLog[] = [
  {
    id: '1',
    roomId: '1',
    roomNumber: '101',
    staffId: 'staff1',
    staffName: 'Sarah Johnson',
    date: new Date().toISOString(),
    cleaningTypeId: '1',
    amenities: [
      { amenityId: '1', amenityName: 'Shampoo', count: 2 },
      { amenityId: '2', amenityName: 'Conditioner', count: 2 },
      { amenityId: '4', amenityName: 'Soap Bar', count: 2 },
      { amenityId: '8', amenityName: 'Water Bottle', count: 2 }
    ]
  },
  {
    id: '2',
    roomId: '3',
    roomNumber: '201',
    staffId: 'staff2',
    staffName: 'Robert Chen',
    date: subDays(new Date(), 1).toISOString(),
    cleaningTypeId: '4',
    amenities: [
      { amenityId: '1', amenityName: 'Shampoo', count: 2 },
      { amenityId: '2', amenityName: 'Conditioner', count: 2 },
      { amenityId: '3', amenityName: 'Body Lotion', count: 1 },
      { amenityId: '4', amenityName: 'Soap Bar', count: 2 },
      { amenityId: '8', amenityName: 'Water Bottle', count: 4 },
      { amenityId: '9', amenityName: 'Coffee Pods', count: 4 }
    ]
  },
  {
    id: '3',
    roomId: '4',
    roomNumber: '301',
    staffId: 'staff3',
    staffName: 'Maria Lopez',
    date: subDays(new Date(), 2).toISOString(),
    cleaningTypeId: '1',
    amenities: [
      { amenityId: '1', amenityName: 'Shampoo', count: 4 },
      { amenityId: '2', amenityName: 'Conditioner', count: 4 },
      { amenityId: '3', amenityName: 'Body Lotion', count: 2 },
      { amenityId: '4', amenityName: 'Soap Bar', count: 4 },
      { amenityId: '5', amenityName: 'Toothbrush Kit', count: 4 },
      { amenityId: '6', amenityName: 'Slippers', count: 4 },
      { amenityId: '7', amenityName: 'Bathrobe', count: 4 },
      { amenityId: '8', amenityName: 'Water Bottle', count: 6 },
      { amenityId: '9', amenityName: 'Coffee Pods', count: 6 },
      { amenityId: '10', amenityName: 'Tea Bags', count: 6 }
    ]
  }
];

export const AmenityLogViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'room', 'staff'

  const filteredLogs = amenityLogs.filter(log => {
    if (searchTerm === '') return true;
    
    if (filter === 'room') {
      return log.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    }
    else if (filter === 'staff') {
      return log.staffName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    else {
      return (
        log.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.staffName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Amenity Usage Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="room">Room</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {filteredLogs.map((log) => (
              <AccordionItem key={log.id} value={log.id}>
                <AccordionTrigger>
                  <div className="flex flex-col sm:flex-row justify-between w-full">
                    <div className="flex-1">
                      <span className="font-medium">Room {log.roomNumber}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-muted-foreground">{log.staffName}</span>
                    </div>
                    <div className="flex-1 text-right">
                      <span className="text-muted-foreground">{format(new Date(log.date), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Amenity</TableHead>
                          <TableHead className="text-right">Count</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {log.amenities.map((item) => (
                          <TableRow key={item.amenityId}>
                            <TableCell>{item.amenityName}</TableCell>
                            <TableCell className="text-right">{item.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No amenity logs found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
