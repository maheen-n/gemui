import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InventoryTransaction } from '@/types';
import { 
  mockInventoryTransactions,
  getAllRoomAssistants,
  filterTransactions,
  calculateInventorySummary,
  getDateRangePresets
} from '@/utils/reportUtils';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AmenityReport = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [reportView, setReportView] = useState<'ra-cart' | 'room' | 'items'>('ra-cart');

  const roomAssistants = useMemo(() => getAllRoomAssistants(mockInventoryTransactions), []);
  const dateRangePresets = useMemo(() => getDateRangePresets(), []);
  
  const filteredTransactions = useMemo(() => 
    filterTransactions(mockInventoryTransactions, startDate, endDate, selectedStaff),
    [startDate, endDate, selectedStaff]
  );

  const inventorySummary = useMemo(() => 
    calculateInventorySummary(filteredTransactions),
    [filteredTransactions]
  );

  const resetFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedStaff(null);
  };

  const RoomBasedView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Room-Based Amenity Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Number</TableHead>
              <TableHead>Total Items</TableHead>
              <TableHead>Last Service Date</TableHead>
              <TableHead>Room Assistant</TableHead>
              <TableHead>Items Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(
              filteredTransactions.reduce((acc, transaction) => {
                const roomKey = transaction.roomNumber;
                if (!acc[roomKey]) {
                  acc[roomKey] = {
                    roomNumber: transaction.roomNumber,
                    totalItems: 0,
                    lastService: transaction.date,
                    lastAssistant: transaction.staffName,
                    items: {}
                  };
                }
                
                transaction.items.forEach(item => {
                  acc[roomKey].totalItems += item.count;
                  if (!acc[roomKey].items[item.amenityName]) {
                    acc[roomKey].items[item.amenityName] = 0;
                  }
                  acc[roomKey].items[item.amenityName] += item.count;
                });

                if (new Date(transaction.date) > new Date(acc[roomKey].lastService)) {
                  acc[roomKey].lastService = transaction.date;
                  acc[roomKey].lastAssistant = transaction.staffName;
                }

                return acc;
              }, {} as Record<string, any>)
            ).map(([roomNumber, data]) => (
              <TableRow key={roomNumber}>
                <TableCell>{roomNumber}</TableCell>
                <TableCell>{data.totalItems}</TableCell>
                <TableCell>{format(new Date(data.lastService), "MMM d, yyyy HH:mm")}</TableCell>
                <TableCell>{data.lastAssistant}</TableCell>
                <TableCell>
                  {Object.entries(data.items)
                    .map(([item, count]) => `${item}: ${count}`)
                    .join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const ItemBasedView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Item-Based Usage Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Total Used</TableHead>
              <TableHead className="text-right">Most Used In Room</TableHead>
              <TableHead>Last Used By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(
              filteredTransactions.reduce((acc, transaction) => {
                transaction.items.forEach(item => {
                  if (!acc[item.amenityName]) {
                    acc[item.amenityName] = {
                      name: item.amenityName,
                      category: item.category,
                      totalUsed: 0,
                      roomUsage: {},
                      lastUsedBy: transaction.staffName,
                      lastUsedDate: transaction.date
                    };
                  }
                  
                  acc[item.amenityName].totalUsed += item.count;
                  if (!acc[item.amenityName].roomUsage[transaction.roomNumber]) {
                    acc[item.amenityName].roomUsage[transaction.roomNumber] = 0;
                  }
                  acc[item.amenityName].roomUsage[transaction.roomNumber] += item.count;

                  if (new Date(transaction.date) > new Date(acc[item.amenityName].lastUsedDate)) {
                    acc[item.amenityName].lastUsedBy = transaction.staffName;
                    acc[item.amenityName].lastUsedDate = transaction.date;
                  }
                });
                return acc;
              }, {} as Record<string, any>)
            ).map(([itemName, data]) => {
              const mostUsedRoom = Object.entries(data.roomUsage)
                .sort(([,a], [,b]) => (b as number) - (a as number))[0];
              
              return (
                <TableRow key={itemName}>
                  <TableCell>{itemName}</TableCell>
                  <TableCell>{data.category}</TableCell>
                  <TableCell className="text-right">{data.totalUsed}</TableCell>
                  <TableCell className="text-right">
                    {mostUsedRoom ? `Room ${mostUsedRoom[0]} (${mostUsedRoom[1]})` : '-'}
                  </TableCell>
                  <TableCell>{data.lastUsedBy}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Amenity Reports</h1>
            <p className="text-muted-foreground">Track and analyze amenity usage across rooms and items</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/operations/housekeeping/amenity">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Amenity Management
              </Link>
            </Button>
          </div>
        </div>

        {/* Report Type Selection */}
        <Tabs defaultValue="ra-cart" className="w-full" onValueChange={(val) => setReportView(val as 'ra-cart' | 'room' | 'items')}>
          <TabsList>
            <TabsTrigger value="ra-cart">RA Cart Report</TabsTrigger>
            <TabsTrigger value="room">Room-Based Report</TabsTrigger>
            <TabsTrigger value="items">Item-Based Report</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {/* Compact Filters */}
            <div className="flex gap-4 items-end mb-4">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate && endDate ? (
                        <>
                          {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                        </>
                      ) : (
                        <span>Pick date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate || undefined}
                      onSelect={setStartDate}
                      className="p-3"
                    />
                    <Calendar
                      mode="single"
                      selected={endDate || undefined}
                      onSelect={setEndDate}
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <Select 
                value={selectedStaff ?? "all"} 
                onValueChange={val => setSelectedStaff(val === "all" ? null : val)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Room Assistants">
                    {selectedStaff ? roomAssistants.find(s => s.id === selectedStaff)?.name ?? "All Room Assistants" : "All Room Assistants"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Room Assistants</SelectItem>
                  {roomAssistants.map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                {dateRangePresets.slice(0, 3).map(preset => (
                  <Button 
                    key={preset.label} 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setStartDate(preset.start);
                      setEndDate(preset.end);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="ra-cart">
              {/* Original RA Cart Report */}
              <Card>
                <CardHeader>
                  <CardTitle>RA Cart Activity Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Staff</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Taken</TableHead>
                        <TableHead className="text-right">Returned</TableHead>
                        <TableHead className="text-right">Outstanding</TableHead>
                        <TableHead>Last Activity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventorySummary.map(item => {
                        const lastTransaction = filteredTransactions
                          .filter(t => t.items.some(i => i.amenityId === item.amenityId))
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                        return (
                          <TableRow key={item.amenityId}>
                            <TableCell>{lastTransaction?.staffName || "-"}</TableCell>
                            <TableCell className="font-medium">{item.amenityName}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell className="text-right">{item.takenCount}</TableCell>
                            <TableCell className="text-right">{item.returnedCount}</TableCell>
                            <TableCell className="text-right font-medium">
                              {item.takenCount - item.returnedCount}
                            </TableCell>
                            <TableCell>{lastTransaction ? format(new Date(lastTransaction.date), "MMM d, h:mm a") : "-"}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="room">
              <RoomBasedView />
            </TabsContent>

            <TabsContent value="items">
              <ItemBasedView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AmenityReport;
