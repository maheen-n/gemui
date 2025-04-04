
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { Amenity, RoomType, RoomAmenityConfig } from '@/types';

// Mock data
const initialAmenities: Amenity[] = [
  { id: '1', name: 'Shampoo', category: 'Bath', defaultCount: 2, description: 'Small bottles of shampoo' },
  { id: '2', name: 'Conditioner', category: 'Bath', defaultCount: 2, description: 'Small bottles of conditioner' },
  { id: '3', name: 'Body Lotion', category: 'Bath', defaultCount: 1, description: 'Body moisturizer' },
  { id: '4', name: 'Soap Bar', category: 'Bath', defaultCount: 2, description: 'Hand and body soap' },
  { id: '5', name: 'Toothbrush Kit', category: 'Personal Care', defaultCount: 2, description: 'Toothbrush with small toothpaste' },
  { id: '6', name: 'Slippers', category: 'Comfort', defaultCount: 2, description: 'One-size-fits-all slippers' },
  { id: '7', name: 'Bathrobe', category: 'Comfort', defaultCount: 2, description: 'Cotton bathrobe' },
  { id: '8', name: 'Water Bottle', category: 'Beverage', defaultCount: 4, description: '500ml bottled water' },
  { id: '9', name: 'Coffee Pods', category: 'Beverage', defaultCount: 4, description: 'Coffee capsules for in-room machine' },
  { id: '10', name: 'Tea Bags', category: 'Beverage', defaultCount: 4, description: 'Assorted tea bags' },
];

const roomTypes: RoomType[] = [
  { id: '1', name: 'Standard', description: 'Standard Room', price: 99, capacity: 2, count: 10, amenities: [] },
  { id: '2', name: 'Deluxe', description: 'Deluxe Room', price: 149, capacity: 2, count: 8, amenities: [] },
  { id: '3', name: 'Suite', description: 'Suite', price: 249, capacity: 4, count: 5, amenities: [] },
  { id: '4', name: 'Presidential Suite', description: 'Presidential Suite', price: 499, capacity: 6, count: 2, amenities: [] },
];

const initialRoomAmenityConfig: RoomAmenityConfig[] = [
  { roomTypeId: '1', amenityId: '1', count: 2 },
  { roomTypeId: '1', amenityId: '2', count: 2 },
  { roomTypeId: '1', amenityId: '4', count: 2 },
  { roomTypeId: '1', amenityId: '8', count: 2 },
  { roomTypeId: '2', amenityId: '1', count: 2 },
  { roomTypeId: '2', amenityId: '2', count: 2 },
  { roomTypeId: '2', amenityId: '3', count: 1 },
  { roomTypeId: '2', amenityId: '4', count: 2 },
  { roomTypeId: '2', amenityId: '8', count: 4 },
  { roomTypeId: '2', amenityId: '9', count: 4 },
  { roomTypeId: '3', amenityId: '1', count: 4 },
  { roomTypeId: '3', amenityId: '2', count: 4 },
  { roomTypeId: '3', amenityId: '3', count: 2 },
  { roomTypeId: '3', amenityId: '4', count: 4 },
  { roomTypeId: '3', amenityId: '5', count: 4 },
  { roomTypeId: '3', amenityId: '6', count: 4 },
  { roomTypeId: '3', amenityId: '7', count: 4 },
  { roomTypeId: '3', amenityId: '8', count: 6 },
  { roomTypeId: '3', amenityId: '9', count: 6 },
  { roomTypeId: '3', amenityId: '10', count: 6 },
];

export const AmenityConfiguration = () => {
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);
  const [newAmenity, setNewAmenity] = useState<Partial<Amenity>>({ name: '', category: 'Bath', defaultCount: 1 });
  const [selectedRoomType, setSelectedRoomType] = useState<string>(roomTypes[0].id);
  const [roomAmenityConfig, setRoomAmenityConfig] = useState<RoomAmenityConfig[]>(initialRoomAmenityConfig);
  const [isAddingAmenity, setIsAddingAmenity] = useState(false);

  // Get the selected room type object
  const currentRoomType = roomTypes.find(rt => rt.id === selectedRoomType);

  // Get amenities for the selected room type
  const roomAmenities = roomAmenityConfig
    .filter(config => config.roomTypeId === selectedRoomType)
    .map(config => {
      const amenity = amenities.find(a => a.id === config.amenityId);
      return {
        ...config,
        amenityName: amenity?.name || '',
        category: amenity?.category || '',
      };
    });

  // Handle adding a new amenity
  const handleAddAmenity = () => {
    if (!newAmenity.name) return;
    
    const id = String(Date.now());
    const amenity: Amenity = {
      id,
      name: newAmenity.name || '',
      category: newAmenity.category || 'Bath',
      defaultCount: newAmenity.defaultCount || 1,
      description: newAmenity.description
    };
    
    setAmenities([...amenities, amenity]);
    setNewAmenity({ name: '', category: 'Bath', defaultCount: 1 });
    setIsAddingAmenity(false);
  };

  // Handle updating amenity count for a room type
  const handleUpdateCount = (amenityId: string, count: number) => {
    const existingIndex = roomAmenityConfig.findIndex(
      config => config.roomTypeId === selectedRoomType && config.amenityId === amenityId
    );

    if (existingIndex >= 0) {
      const updated = [...roomAmenityConfig];
      updated[existingIndex] = { ...updated[existingIndex], count };
      setRoomAmenityConfig(updated);
    } else {
      setRoomAmenityConfig([
        ...roomAmenityConfig,
        { roomTypeId: selectedRoomType, amenityId, count }
      ]);
    }
  };

  // Handle adding an amenity to a room type
  const handleAddAmenityToRoom = (amenityId: string) => {
    const amenity = amenities.find(a => a.id === amenityId);
    if (!amenity) return;

    const exists = roomAmenityConfig.some(
      config => config.roomTypeId === selectedRoomType && config.amenityId === amenityId
    );

    if (!exists) {
      setRoomAmenityConfig([
        ...roomAmenityConfig,
        { 
          roomTypeId: selectedRoomType, 
          amenityId: amenityId, 
          count: amenity.defaultCount 
        }
      ]);
    }
  };

  // Handle removing an amenity from a room type
  const handleRemoveAmenityFromRoom = (amenityId: string) => {
    setRoomAmenityConfig(
      roomAmenityConfig.filter(
        config => !(config.roomTypeId === selectedRoomType && config.amenityId === amenityId)
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amenities Master List */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities Master List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isAddingAmenity ? (
                <div className="space-y-4">
                  <Input 
                    placeholder="Amenity Name" 
                    value={newAmenity.name} 
                    onChange={(e) => setNewAmenity({...newAmenity, name: e.target.value})}
                  />
                  <Select 
                    value={newAmenity.category} 
                    onValueChange={(value) => setNewAmenity({...newAmenity, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bath">Bath</SelectItem>
                      <SelectItem value="Personal Care">Personal Care</SelectItem>
                      <SelectItem value="Comfort">Comfort</SelectItem>
                      <SelectItem value="Beverage">Beverage</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center">
                    <label className="mr-2">Default Count:</label>
                    <Input 
                      type="number" 
                      className="w-20" 
                      value={newAmenity.defaultCount} 
                      onChange={(e) => setNewAmenity({...newAmenity, defaultCount: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <Input 
                    placeholder="Description (optional)" 
                    value={newAmenity.description || ''} 
                    onChange={(e) => setNewAmenity({...newAmenity, description: e.target.value})}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingAmenity(false)}>Cancel</Button>
                    <Button onClick={handleAddAmenity}>Save Amenity</Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsAddingAmenity(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Amenity
                </Button>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Default Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amenities.map((amenity) => (
                    <TableRow key={amenity.id}>
                      <TableCell>{amenity.name}</TableCell>
                      <TableCell>{amenity.category}</TableCell>
                      <TableCell>{amenity.defaultCount}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleAddAmenityToRoom(amenity.id)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Room Type Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Room Type Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(roomType => (
                    <SelectItem key={roomType.id} value={roomType.id}>
                      {roomType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {currentRoomType && (
                <p className="text-sm text-muted-foreground">
                  Configuring amenities for {currentRoomType.name} rooms
                </p>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amenity</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roomAmenities.map((item) => (
                    <TableRow key={item.amenityId}>
                      <TableCell>{item.amenityName}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          className="w-20" 
                          value={item.count} 
                          onChange={(e) => handleUpdateCount(item.amenityId, parseInt(e.target.value) || 0)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveAmenityFromRoom(item.amenityId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {roomAmenities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No amenities configured for this room type. Add amenities from the left panel.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Button className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
