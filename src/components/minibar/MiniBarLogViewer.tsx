
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MiniBarLog } from '@/types';
import { Calendar, Search } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Mock data
const minibarLogs: MiniBarLog[] = [
  {
    id: '1',
    roomId: '1',
    roomNumber: '101',
    staffId: 'staff1',
    staffName: 'Sarah Johnson',
    date: new Date().toISOString(),
    items: [
      { itemId: '1', itemName: 'Coca Cola', consumed: 1, price: 5.00 },
      { itemId: '4', itemName: 'Chocolate Bar', consumed: 1, price: 4.00 },
    ],
    totalCharge: 9.00
  },
  {
    id: '2',
    roomId: '3',
    roomNumber: '201',
    staffId: 'staff2',
    staffName: 'Robert Chen',
    date: subDays(new Date(), 1).toISOString(),
    items: [
      { itemId: '3', itemName: 'Beer', consumed: 2, price: 7.50 },
      { itemId: '5', itemName: 'Nuts', consumed: 1, price: 6.00 },
    ],
    totalCharge: 21.00
  },
  {
    id: '3',
    roomId: '4',
    roomNumber: '301',
    staffId: 'staff3',
    staffName: 'Maria Lopez',
    date: subDays(new Date(), 2).toISOString(),
    items: [
      { itemId: '1', itemName: 'Coca Cola', consumed: 2, price: 5.00 },
      { itemId: '2', itemName: 'Mineral Water', consumed: 1, price: 3.50 },
      { itemId: '6', itemName: 'Juice', consumed: 1, price: 4.50 },
    ],
    totalCharge: 18.00
  }
];

export const MiniBarLogViewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'room', 'staff'

  const filteredLogs = minibarLogs.filter(log => {
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
        <CardTitle>Minibar Usage Logs</CardTitle>
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
                          <TableHead>Item</TableHead>
                          <TableHead>Consumed</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {log.items.map((item) => (
                          <TableRow key={item.itemId}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>{item.consumed}</TableCell>
                            <TableCell>${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${(item.consumed * item.price).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="text-right font-medium">Total Charge:</TableCell>
                          <TableCell className="text-right font-medium">${log.totalCharge.toFixed(2)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No minibar logs found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
