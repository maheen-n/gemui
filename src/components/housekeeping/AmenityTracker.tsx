
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Save, Search } from 'lucide-react';
import { Room, Amenity, CleaningType, AmenityLogItem } from '@/types';

// Mock data
const rooms: Room[] = [
  { id: '1', number: '101', type: 'Standard', status: 'available', floor: 1, capacity: 2, rate: 99, amenities: ['TV', 'WiFi', 'AC'] },
  { id: '2', number: '102', type: 'Standard', status: 'occupied', floor: 1, capacity: 2, rate: 99, amenities: ['TV', 'WiFi', 'AC'] },
  { id: '3', number: '201', type: 'Deluxe', status: 'available', floor: 2, capacity: 3, rate: 149, amenities: ['TV', 'WiFi', 'AC', 'Mini Bar'] },
  { id: '4', number: '301', type: 'Suite', status: 'occupied', floor: 3, capacity: 4, rate: 249, amenities: ['TV', 'WiFi', 'AC', 'Mini Bar', 'Jacuzzi'] },
];

const cleaningTypes: CleaningType[] = [
  { id: '1', name: 'Full Cleaning', description: 'Complete room cleaning and amenity refresh', amenityMultiplier: 1, estimatedDuration: 45 },
  { id: '2', name: 'Light Cleaning', description: 'Quick refresh with minimal amenity replenishment', amenityMultiplier: 0.5, estimatedDuration: 20 },
  { id: '3', name: 'Stay-over Service', description: 'Basic service for guests staying multiple nights', amenityMultiplier: 0.25, estimatedDuration: 15 },
  { id: '4', name: 'Checkout Service', description: 'Deep cleaning after guest checkout', amenityMultiplier: 1.1, estimatedDuration: 60 },
];

const amenities: Amenity[] = [
  { id: '1', name: 'Shampoo', category: 'Bath', defaultCount: 2 },
  { id: '2', name: 'Conditioner', category: 'Bath', defaultCount: 2 },
  { id: '3', name: 'Body Lotion', category: 'Bath', defaultCount: 1 },
  { id: '4', name: 'Soap Bar', category: 'Bath', defaultCount: 2 },
  { id: '5', name: 'Toothbrush Kit', category: 'Personal Care', defaultCount: 2 },
  { id: '6', name: 'Slippers', category: 'Comfort', defaultCount: 2 },
  { id: '7', name: 'Bathrobe', category: 'Comfort', defaultCount: 2 },
  { id: '8', name: 'Water Bottle', category: 'Beverage', defaultCount: 4 },
  { id: '9', name: 'Coffee Pods', category: 'Beverage', defaultCount: 4 },
  { id: '10', name: 'Tea Bags', category: 'Beverage', defaultCount: 4 },
];

export const AmenityTracker = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedCleaningType, setSelectedCleaningType] = useState('1'); // Default to Full Cleaning
  const [trackingItems, setTrackingItems] = useState<AmenityLogItem[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  const filteredRooms = rooms.filter(room => 
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCleaningType = cleaningTypes.find(ct => ct.id === selectedCleaningType);

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    
    // Initialize tracking items based on room type and cleaning type
    const roomType = room.type;
    let initialItems: AmenityLogItem[] = [];
    
    // This is a simplified version - in a real app, you would fetch the correct amenities
    // based on the room type configuration
    if (roomType === 'Standard') {
      initialItems = [
        { amenityId: '1', amenityName: 'Shampoo', count: 2 },
        { amenityId: '2', amenityName: 'Conditioner', count: 2 },
        { amenityId: '4', amenityName: 'Soap Bar', count: 2 },
        { amenityId: '8', amenityName: 'Water Bottle', count: 2 }
      ];
    } else if (roomType === 'Deluxe') {
      initialItems = [
        { amenityId: '1', amenityName: 'Shampoo', count: 2 },
        { amenityId: '2', amenityName: 'Conditioner', count: 2 },
        { amenityId: '3', amenityName: 'Body Lotion', count: 1 },
        { amenityId: '4', amenityName: 'Soap Bar', count: 2 },
        { amenityId: '8', amenityName: 'Water Bottle', count: 4 },
        { amenityId: '9', amenityName: 'Coffee Pods', count: 4 }
      ];
    } else {
      initialItems = [
        { amenityId: '1', amenityName: 'Shampoo', count: 4 },
        { amenityId: '2', amenityName: 'Conditioner', count: 4 },
        { amenityId: '3', amenityName: 'Body Lotion', count: 2 },
        { amenityId: '4', amenityName: 'Soap Bar', count: 4 },
        { amenityId: '5', amenityName: 'Toothbrush Kit', count: 4 },
        { amenityId: '6', amenityName: 'Slippers', count: 4 },
        { amenityId: '7', amenityName: 'Bathrobe', count: 4 },
        { amenityId: '8', amenityName: 'Water Bottle', count: 6 },
        { amenityId: '9', amenityName: 'Coffee Pods', count: 6 },
        { amenityId: '10', amenityName: 'Tea Bags', count: 6 }
      ];
    }
    
    setTrackingItems(initialItems);
    setIsTracking(true);
  };

  const handleUpdateCount = (amenityId: string, count: number) => {
    setTrackingItems(prev => 
      prev.map(item => 
        item.amenityId === amenityId 
          ? { ...item, count } 
          : item
      )
    );
  };

  const handleAddAmenity = (amenityId: string) => {
    const amenity = amenities.find(a => a.id === amenityId);
    if (!amenity) return;
    
    const exists = trackingItems.some(item => item.amenityId === amenityId);
    if (exists) return;
    
    setTrackingItems([
      ...trackingItems,
      { amenityId, amenityName: amenity.name, count: amenity.defaultCount }
    ]);
  };

  const handleSaveTracking = () => {
    // Here you would save the tracking data to your backend
    console.log('Saving tracking data:', {
      roomId: selectedRoom?.id,
      roomNumber: selectedRoom?.number,
      staffId: 'current-staff-id',
      staffName: 'Current Staff Name',
      date: new Date().toISOString(),
      cleaningTypeId: selectedCleaningType,
      amenities: trackingItems
    });
    
    // Reset state after saving
    setSelectedRoom(null);
    setTrackingItems([]);
    setIsTracking(false);
  };

  const getRoomStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-500">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-500">Maintenance</Badge>;
      case 'cleaning':
        return <Badge className="bg-yellow-500">Cleaning</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {!isTracking ? (
        <Card>
          <CardHeader>
            <CardTitle>Select Room for Amenity Tracking</CardTitle>
            <CardDescription>
              Choose a room to start tracking amenities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms by number or type..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.number}</TableCell>
                      <TableCell>{room.type}</TableCell>
                      <TableCell>{getRoomStatusBadge(room.status)}</TableCell>
                      <TableCell>{room.floor}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleSelectRoom(room)}>
                          Track Amenities
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold">
                Room {selectedRoom?.number} - {selectedRoom?.type}
              </h2>
              <p className="text-sm text-muted-foreground">
                Tracking amenities for this room
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedCleaningType} onValueChange={setSelectedCleaningType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select cleaning type" />
                </SelectTrigger>
                <SelectContent>
                  {cleaningTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setIsTracking(false)}>
                Cancel
              </Button>
            </div>
          </div>

          {currentCleaningType && (
            <Card className="bg-slate-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{currentCleaningType.name}</p>
                    <p className="text-sm text-muted-foreground">{currentCleaningType.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Est. Duration: <span className="font-medium">{currentCleaningType.estimatedDuration} min</span></p>
                    <p className="text-sm">Amenity Multiplier: <span className="font-medium">x{currentCleaningType.amenityMultiplier}</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Track Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Amenity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trackingItems.map((item) => {
                      const amenity = amenities.find(a => a.id === item.amenityId);
                      return (
                        <TableRow key={item.amenityId}>
                          <TableCell>{item.amenityName}</TableCell>
                          <TableCell>{amenity?.category || 'Unknown'}</TableCell>
                          <TableCell>
                            <Input 
                              type="number" 
                              className="w-20" 
                              value={item.count} 
                              onChange={(e) => handleUpdateCount(item.amenityId, parseInt(e.target.value) || 0)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div>
                  <h3 className="text-sm font-medium mb-2">Add Additional Amenities:</h3>
                  <div className="flex flex-wrap gap-2">
                    {amenities
                      .filter(amenity => !trackingItems.some(item => item.amenityId === amenity.id))
                      .map(amenity => (
                        <Badge 
                          key={amenity.id} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => handleAddAmenity(amenity.id)}
                        >
                          <PlusCircle className="mr-1 h-3 w-3" />
                          {amenity.name}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveTracking} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Amenity Tracking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
