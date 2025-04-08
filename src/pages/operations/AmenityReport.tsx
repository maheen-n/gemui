
import React, { useState, useMemo } from 'react';
import { format, addDays } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarIcon, 
  FilterIcon, 
  RefreshCw, 
  Download, 
  ArrowLeft,
  Box,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { InventoryTransaction } from '@/types';
import { 
  mockInventoryTransactions,
  getAllRoomAssistants,
  filterTransactions,
  groupTransactionsByStaff,
  calculateInventorySummary,
  getDateRangePresets
} from '@/utils/reportUtils';
import { Link } from 'react-router-dom';

const AmenityReport = () => {
  // State for filters
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('summary');

  // Get all room assistants
  const roomAssistants = useMemo(() => getAllRoomAssistants(mockInventoryTransactions), []);
  
  // Date range presets
  const dateRangePresets = useMemo(() => getDateRangePresets(), []);

  // Apply filters to transactions
  const filteredTransactions = useMemo(() => 
    filterTransactions(mockInventoryTransactions, startDate, endDate, selectedStaff),
    [startDate, endDate, selectedStaff]
  );

  // Calculate report data
  const staffGroupedData = useMemo(() => 
    groupTransactionsByStaff(filteredTransactions),
    [filteredTransactions]
  );

  const inventorySummary = useMemo(() => 
    calculateInventorySummary(filteredTransactions),
    [filteredTransactions]
  );

  // Apply date preset
  const applyDatePreset = (preset: { label: string, start: Date, end: Date }) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedStaff(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Amenity Inventory Report</h1>
            <p className="text-muted-foreground">Track inventory items taken and returned by Room Assistants</p>
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

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Report Filters</CardTitle>
            <CardDescription>Filter the report by date range and room assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-from"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate || undefined}
                        onSelect={setStartDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-to"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate || undefined}
                        onSelect={setEndDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="staff">Room Assistant</Label>
                <Select value={selectedStaff || ""} onValueChange={val => setSelectedStaff(val || null)}>
                  <SelectTrigger id="staff">
                    <SelectValue placeholder="All Room Assistants" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Room Assistants</SelectItem>
                    {roomAssistants.map(staff => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quick Date Ranges</Label>
                <div className="flex flex-wrap gap-2">
                  {dateRangePresets.map(preset => (
                    <Button 
                      key={preset.label} 
                      variant="outline" 
                      size="sm"
                      onClick={() => applyDatePreset(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetFilters}
                  >
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Tabs */}
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md">
            <TabsTrigger value="summary">Inventory Summary</TabsTrigger>
            <TabsTrigger value="details">Transaction Details</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Summary</CardTitle>
                <CardDescription>
                  Summary of items taken from and returned to inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Taken</TableHead>
                      <TableHead className="text-right">Returned</TableHead>
                      <TableHead className="text-right">Net Usage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventorySummary.map(item => (
                      <TableRow key={item.amenityId}>
                        <TableCell className="font-medium">{item.amenityName}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.takenCount}</TableCell>
                        <TableCell className="text-right">{item.returnedCount}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.takenCount - item.returnedCount}
                        </TableCell>
                      </TableRow>
                    ))}
                    {inventorySummary.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No data available for the selected filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {inventorySummary.length} items
                </p>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Transaction Details Tab */}
          <TabsContent value="details">
            <div className="space-y-6">
              {staffGroupedData.map(staffData => (
                <Card key={staffData.staffId}>
                  <CardHeader>
                    <CardTitle>{staffData.staffName}</CardTitle>
                    <CardDescription>
                      Inventory transactions for this room assistant
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Items Taken */}
                      <div>
                        <h3 className="text-lg font-medium mb-3">Items Taken from Inventory</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Room</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {staffData.taken.map(transaction => (
                              <TableRow key={transaction.id}>
                                <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}</TableCell>
                                <TableCell>{transaction.roomNumber || 'N/A'}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {transaction.items.map(item => (
                                      <Badge key={item.amenityId} variant="outline" className="mr-1">
                                        {item.amenityName}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {transaction.items.reduce((total, item) => total + item.count, 0)}
                                </TableCell>
                              </TableRow>
                            ))}
                            {staffData.taken.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No items taken during this period
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Items Returned */}
                      <div>
                        <h3 className="text-lg font-medium mb-3">Items Returned to Inventory</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Room</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {staffData.returned.map(transaction => (
                              <TableRow key={transaction.id}>
                                <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy HH:mm')}</TableCell>
                                <TableCell>{transaction.roomNumber || 'N/A'}</TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {transaction.items.map(item => (
                                      <Badge key={item.amenityId} variant="outline" className="mr-1">
                                        {item.amenityName}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {transaction.items.reduce((total, item) => total + item.count, 0)}
                                </TableCell>
                              </TableRow>
                            ))}
                            {staffData.returned.length === 0 && (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                  No items returned during this period
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {staffGroupedData.length === 0 && (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Box className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No data available</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try adjusting your filters to see transaction details
                    </p>
                    <Button onClick={resetFilters} variant="outline" className="mt-4">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AmenityReport;
