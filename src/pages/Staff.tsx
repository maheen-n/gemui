
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, Users } from 'lucide-react';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const staff = [
    { id: 1, name: 'Robert Chen', position: 'Maintenance Technician', department: 'Maintenance', status: 'active', shifts: 'Morning', phone: '+1 (555) 111-2233', email: 'robert.chen@hotelharmony.com' },
    { id: 2, name: 'Maria Lopez', position: 'Housekeeping Supervisor', department: 'Housekeeping', status: 'active', shifts: 'Morning', phone: '+1 (555) 222-3344', email: 'maria.lopez@hotelharmony.com' },
    { id: 3, name: 'David Wilson', position: 'Maintenance Technician', department: 'Maintenance', status: 'active', shifts: 'Evening', phone: '+1 (555) 333-4455', email: 'david.wilson@hotelharmony.com' },
    { id: 4, name: 'Sarah Johnson', position: 'Room Attendant', department: 'Housekeeping', status: 'active', shifts: 'Morning', phone: '+1 (555) 444-5566', email: 'sarah.johnson@hotelharmony.com' },
    { id: 5, name: 'John Smith', position: 'Room Attendant', department: 'Housekeeping', status: 'on-leave', shifts: 'Evening', phone: '+1 (555) 555-6677', email: 'john.smith@hotelharmony.com' },
    { id: 6, name: 'Lisa Rodriguez', position: 'Front Desk Manager', department: 'Front Desk', status: 'active', shifts: 'Morning', phone: '+1 (555) 666-7788', email: 'lisa.rodriguez@hotelharmony.com' },
    { id: 7, name: 'Michael Brown', position: 'Front Desk Agent', department: 'Front Desk', status: 'active', shifts: 'Evening', phone: '+1 (555) 777-8899', email: 'michael.brown@hotelharmony.com' },
  ];

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'on-leave':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      case 'terminated':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Terminated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground">Manage hotel staff and assignments</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>

        <div className="flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search staff..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Staff Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Shifts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>{member.shifts}</TableCell>
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

export default Staff;
