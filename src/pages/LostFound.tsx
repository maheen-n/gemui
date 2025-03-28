
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Search, ShoppingBag } from 'lucide-react';

const LostFound = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const items = [
    { id: 1, name: 'Gold Watch', location: 'Room 301', foundDate: '2023-10-14', status: 'unclaimed', description: 'Gold Rolex watch found on the nightstand' },
    { id: 2, name: 'Phone Charger', location: 'Lobby', foundDate: '2023-10-15', status: 'claimed', description: 'iPhone charger found on the lobby sofa' },
    { id: 3, name: 'Sunglasses', location: 'Pool Area', foundDate: '2023-10-15', status: 'unclaimed', description: 'Ray-Ban sunglasses near the pool chair #5' },
    { id: 4, name: 'Blue Jacket', location: 'Restaurant', foundDate: '2023-10-13', status: 'claimed', description: 'Child\'s blue jacket left on a chair' },
    { id: 5, name: 'Wallet', location: 'Room 210', foundDate: '2023-10-14', status: 'unclaimed', description: 'Black leather wallet with ID inside' },
    { id: 6, name: 'Room Key', location: 'Elevator', foundDate: '2023-10-15', status: 'unclaimed', description: 'Room key for 405 found in elevator' },
    { id: 7, name: 'Diamond Earrings', location: 'Spa', foundDate: '2023-10-12', status: 'claimed', description: 'Pair of diamond stud earrings found near sink' },
  ];

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unclaimed':
        return <Badge className="bg-yellow-500">Unclaimed</Badge>;
      case 'claimed':
        return <Badge className="bg-green-500">Claimed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Lost & Found</h1>
            <p className="text-muted-foreground">Track and manage found items</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Log New Item
          </Button>
        </div>

        <div className="flex items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Lost & Found Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Location Found</TableHead>
                  <TableHead>Date Found</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.foundDate}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm" disabled={item.status === 'claimed'}>
                          Mark Claimed
                        </Button>
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

export default LostFound;
