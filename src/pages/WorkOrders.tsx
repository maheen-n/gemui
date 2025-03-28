
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Wrench } from 'lucide-react';

const WorkOrders = () => {
  const workOrders = [
    { id: 1, title: 'Repair broken shower in room 302', requestedBy: 'Guest', technician: 'Robert Chen', requestDate: '2023-10-14', status: 'in-progress', priority: 'high' },
    { id: 2, title: 'Fix faulty air conditioning in room 415', requestedBy: 'Staff', technician: 'David Wilson', requestDate: '2023-10-15', status: 'pending', priority: 'high' },
    { id: 3, title: 'Replace broken TV remote in room 210', requestedBy: 'Guest', technician: 'Unassigned', requestDate: '2023-10-15', status: 'pending', priority: 'low' },
    { id: 4, title: 'Repair leaking faucet in room 118', requestedBy: 'Housekeeping', technician: 'Robert Chen', requestDate: '2023-10-13', status: 'completed', priority: 'medium' },
    { id: 5, title: 'Fix door lock in room 225', requestedBy: 'Guest', technician: 'David Wilson', requestDate: '2023-10-14', status: 'in-progress', priority: 'high' },
    { id: 6, title: 'Unclog toilet in room 301', requestedBy: 'Guest', technician: 'Robert Chen', requestDate: '2023-10-15', status: 'pending', priority: 'high' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-500 text-white">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Work Orders</h1>
            <p className="text-muted-foreground">Manage maintenance and repair requests</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Work Order
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Wrench className="mr-2 h-5 w-5" />
              Active Work Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.title}</TableCell>
                    <TableCell>{order.requestedBy}</TableCell>
                    <TableCell>{order.technician}</TableCell>
                    <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkOrders;
