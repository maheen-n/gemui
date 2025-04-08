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

const AmenityReport = () => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

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

        {/* Compact Filters */}
        <div className="flex gap-4 items-end">
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
          
          <Select value={selectedStaff || "all"} onValueChange={val => setSelectedStaff(val === "all" ? null : val)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Room Assistants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Room Assistants</SelectItem>
              {roomAssistants.map(staff => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
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

        {/* Combined Report View */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Activity Report</CardTitle>
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
      </div>
    </DashboardLayout>
  );
};

export default AmenityReport;
