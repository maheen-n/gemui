
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MiniBarItem, Room } from '@/types';
import { Building2, Clipboard, Save } from 'lucide-react';

// Mock data
const miniBarItems: MiniBarItem[] = [
  {
    id: '1',
    name: 'Coca Cola',
    description: '330ml can',
    category: 'Soft Drinks',
    defaultCount: 2,
    price: 5.00,
    image: '/placeholder.svg',
  },
  {
    id: '2',
    name: 'Mineral Water',
    description: '500ml bottle',
    category: 'Water',
    defaultCount: 2,
    price: 3.50,
    image: '/placeholder.svg',
  },
  {
    id: '3',
    name: 'Beer',
    description: '330ml bottle',
    category: 'Alcoholic Beverages',
    defaultCount: 2,
    price: 7.50,
    image: '/placeholder.svg',
  },
  {
    id: '4',
    name: 'Chocolate Bar',
    description: '50g',
    category: 'Snacks',
    defaultCount: 2,
    price: 4.00,
    image: '/placeholder.svg',
  },
  {
    id: '5',
    name: 'Nuts',
    description: '30g pack',
    category: 'Snacks',
    defaultCount: 1,
    price: 6.00,
    image: '/placeholder.svg',
  },
  {
    id: '6',
    name: 'Juice',
    description: '250ml bottle',
    category: 'Soft Drinks',
    defaultCount: 2,
    price: 4.50,
    image: '/placeholder.svg',
  },
];

// Mock rooms
const rooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'Standard',
    status: 'occupied',
    floor: 1,
    capacity: 2,
    rate: 100,
    amenities: [],
  },
  {
    id: '2',
    number: '102',
    type: 'Standard',
    status: 'occupied',
    floor: 1,
    capacity: 2,
    rate: 100,
    amenities: [],
  },
  {
    id: '3',
    number: '201',
    type: 'Deluxe',
    status: 'occupied',
    floor: 2,
    capacity: 2,
    rate: 150,
    amenities: [],
  },
  {
    id: '4',
    number: '301',
    type: 'Suite',
    status: 'occupied',
    floor: 3,
    capacity: 4,
    rate: 250,
    amenities: [],
  },
];

interface MiniBarUsageItem {
  itemId: string;
  itemName: string;
  defaultCount: number;
  consumed: number;
  price: number;
}

export const MiniBarTracker = () => {
  const { toast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [miniBarUsage, setMiniBarUsage] = useState<MiniBarUsageItem[]>([]);
  const [totalCharge, setTotalCharge] = useState<number>(0);
  
  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId);
    
    // Reset the form with default values
    const usageItems = miniBarItems.map(item => ({
      itemId: item.id,
      itemName: item.name,
      defaultCount: item.defaultCount,
      consumed: 0,
      price: item.price,
    }));
    
    setMiniBarUsage(usageItems);
    setTotalCharge(0);
  };
  
  const handleConsumedChange = (itemId: string, consumed: number) => {
    const updatedUsage = miniBarUsage.map(item => {
      if (item.itemId === itemId) {
        return { ...item, consumed };
      }
      return item;
    });
    
    setMiniBarUsage(updatedUsage);
    
    // Recalculate total charge
    const total = updatedUsage.reduce((sum, item) => {
      return sum + (item.consumed * item.price);
    }, 0);
    
    setTotalCharge(total);
  };
  
  const handleSubmit = () => {
    if (!selectedRoom) {
      toast({
        title: "Error",
        description: "Please select a room",
        variant: "destructive"
      });
      return;
    }
    
    // Filter out items with no consumption
    const consumedItems = miniBarUsage.filter(item => item.consumed > 0);
    
    if (consumedItems.length === 0) {
      toast({
        title: "Warning",
        description: "No minibar items were consumed",
        variant: "default"
      });
      return;
    }
    
    // Here you would typically send this data to your backend
    console.log("Submitting minibar usage:", {
      roomId: selectedRoom,
      roomNumber: rooms.find(r => r.id === selectedRoom)?.number,
      items: consumedItems,
      totalCharge,
      date: new Date().toISOString(),
    });
    
    toast({
      title: "Success",
      description: "Minibar usage has been recorded",
      variant: "default"
    });
    
    // Reset form
    setSelectedRoom('');
    setMiniBarUsage([]);
    setTotalCharge(0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minibar Usage Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label htmlFor="room" className="text-sm font-medium">Room</label>
              <Select value={selectedRoom} onValueChange={handleRoomChange}>
                <SelectTrigger id="room" className="w-full">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>Room {room.number} ({room.type})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedRoom && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Minibar Items Consumption</h3>
                <p className="text-sm text-muted-foreground">Record items consumed from the minibar</p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Default Count</TableHead>
                    <TableHead>Consumed</TableHead>
                    <TableHead className="text-right">Charge</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {miniBarUsage.map((item) => (
                    <TableRow key={item.itemId}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{item.defaultCount}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={item.defaultCount}
                          value={item.consumed}
                          onChange={(e) => handleConsumedChange(item.itemId, parseInt(e.target.value) || 0)}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell className="text-right">${(item.consumed * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-medium">Total Charge:</TableCell>
                    <TableCell className="text-right font-medium">${totalCharge.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="flex justify-end gap-4">
                <Button variant="outline" type="button" onClick={() => {
                  setSelectedRoom('');
                  setMiniBarUsage([]);
                  setTotalCharge(0);
                }}>
                  Cancel
                </Button>
                <Button variant="default" type="button" onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Minibar Usage
                </Button>
              </div>
            </div>
          )}
          
          {!selectedRoom && (
            <div className="flex flex-col items-center justify-center py-12">
              <Clipboard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Select a Room</h3>
              <p className="text-muted-foreground text-center max-w-md mt-2">
                Choose a room to record minibar usage. The system will track consumed items and calculate charges.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
