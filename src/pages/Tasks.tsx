
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, PlusCircle } from 'lucide-react';

const Tasks = () => {
  const tasks = [
    { id: 1, title: 'Clean room 304', priority: 'high', assigned: 'Maria Lopez', dueDate: '2023-10-16', status: 'pending' },
    { id: 2, title: 'Restock mini bar in room 210', priority: 'medium', assigned: 'John Smith', dueDate: '2023-10-16', status: 'in-progress' },
    { id: 3, title: 'Fix AC in room 115', priority: 'high', assigned: 'Robert Chen', dueDate: '2023-10-15', status: 'completed' },
    { id: 4, title: 'Replace towels in room 402', priority: 'low', assigned: 'Sarah Johnson', dueDate: '2023-10-17', status: 'pending' },
    { id: 5, title: 'Check pool chemical levels', priority: 'medium', assigned: 'David Wilson', dueDate: '2023-10-16', status: 'pending' },
    { id: 6, title: 'Repair leaking faucet in room 118', priority: 'medium', assigned: 'Robert Chen', dueDate: '2023-10-15', status: 'in-progress' },
    { id: 7, title: 'Update guest information', priority: 'low', assigned: 'Maria Lopez', dueDate: '2023-10-18', status: 'pending' },
    { id: 8, title: 'Replace light bulbs in hallway', priority: 'low', assigned: 'John Smith', dueDate: '2023-10-17', status: 'completed' },
  ];

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tasks Management</h1>
            <p className="text-muted-foreground">Manage and track all hotel maintenance tasks</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5" />
              Current Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>{task.assigned}</TableCell>
                    <TableCell>{task.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
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
    </DashboardLayout>
  );
};

export default Tasks;
