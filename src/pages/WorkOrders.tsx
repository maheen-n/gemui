
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Filter, PlusCircle, Search, Wrench } from 'lucide-react';

const WorkOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const workOrders = [
    { id: 1, title: 'Repair broken shower in room 302', requestedBy: 'Guest', technician: 'Robert Chen', requestDate: '2023-10-14', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Fix faulty air conditioning in room 415', requestedBy: 'Staff', technician: 'David Wilson', requestDate: '2023-10-15', status: 'pending', priority: 'high' },
    { id: 3, title: 'Replace broken TV remote in room 210', requestedBy: 'Guest', technician: 'Unassigned', requestDate: '2023-10-15', status: 'pending', priority: 'low' },
    { id: 4, title: 'Repair leaking faucet in room 118', requestedBy: 'Housekeeping', technician: 'Robert Chen', requestDate: '2023-10-13', status: 'completed', priority: 'medium' },
    { id: 5, title: 'Fix door lock in room 225', requestedBy: 'Guest', technician: 'David Wilson', requestDate: '2023-10-14', status: 'in-progress', priority: 'high' },
    { id: 6, title: 'Unclog toilet in room 301', requestedBy: 'Guest', technician: 'Robert Chen', requestDate: '2023-10-15', status: 'pending', priority: 'high' },
  ];

  const filteredWorkOrders = searchTerm ? workOrders.filter(order => 
    order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  ) : workOrders;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="font-medium">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500 dark:bg-yellow-600 font-medium">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-500 text-white dark:bg-green-600 font-medium">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
            <p className="text-muted-foreground mt-1">Manage maintenance and repair requests</p>
          </div>
          <Button className="shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Work Order
          </Button>
        </header>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search work orders..." 
              className="pl-8 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="shrink-0">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card className="border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-muted/40">
            <CardTitle className="flex items-center text-xl">
              <Wrench className="mr-2 h-5 w-5" />
              Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-1/3">Description</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.length > 0 ? (
                  filteredWorkOrders.map((order) => (
                    <TableRow key={order.id} className="group">
                      <TableCell className="font-medium">{order.title}</TableCell>
                      <TableCell>{order.requestedBy}</TableCell>
                      <TableCell>{order.technician}</TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No work orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkOrders;
