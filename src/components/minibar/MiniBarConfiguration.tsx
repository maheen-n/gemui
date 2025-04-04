
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { MiniBarItem, RoomType } from '@/types';
import { Edit, Plus, Save, Trash } from 'lucide-react';

// Mock data
const initialMiniBarItems: MiniBarItem[] = [
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

const roomTypes: RoomType[] = [
  { id: '1', name: 'Standard', description: 'Standard Room', price: 100, capacity: 2, amenities: [], count: 10 },
  { id: '2', name: 'Deluxe', description: 'Deluxe Room', price: 150, capacity: 2, amenities: [], count: 8 },
  { id: '3', name: 'Suite', description: 'Suite Room', price: 250, capacity: 4, amenities: [], count: 5 },
];

export const MiniBarConfiguration = () => {
  const { toast } = useToast();
  const [miniBarItems, setMiniBarItems] = useState<MiniBarItem[]>(initialMiniBarItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MiniBarItem | null>(null);
  const [activeTab, setActiveTab] = useState('items');
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [defaultCount, setDefaultCount] = useState(1);
  const [price, setPrice] = useState(0);
  
  // Room Type Config states
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [roomTypeConfig, setRoomTypeConfig] = useState<{
    [roomTypeId: string]: {
      [itemId: string]: number
    }
  }>({});
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setDefaultCount(1);
    setPrice(0);
    setSelectedItem(null);
  };
  
  const handleOpenDialog = (item: MiniBarItem | null = null) => {
    if (item) {
      setSelectedItem(item);
      setName(item.name);
      setDescription(item.description || '');
      setCategory(item.category);
      setDefaultCount(item.defaultCount);
      setPrice(item.price);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveItem = () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }
    
    if (price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedItem) {
      // Update existing item
      const updatedItems = miniBarItems.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              name, 
              description, 
              category, 
              defaultCount, 
              price 
            } 
          : item
      );
      setMiniBarItems(updatedItems);
      toast({
        title: "Success",
        description: "Minibar item updated successfully",
      });
    } else {
      // Add new item
      const newItem: MiniBarItem = {
        id: `${Date.now()}`,
        name,
        description,
        category,
        defaultCount,
        price,
        image: '/placeholder.svg',
      };
      setMiniBarItems([...miniBarItems, newItem]);
      toast({
        title: "Success",
        description: "New minibar item added successfully",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleDeleteItem = (id: string) => {
    setMiniBarItems(miniBarItems.filter(item => item.id !== id));
    toast({
      title: "Success",
      description: "Minibar item deleted successfully",
    });
  };
  
  const handleRoomTypeSelect = (roomTypeId: string) => {
    setSelectedRoomType(roomTypeId);
    
    // Initialize configuration if not exists
    if (!roomTypeConfig[roomTypeId]) {
      const initialConfig: { [itemId: string]: number } = {};
      miniBarItems.forEach(item => {
        initialConfig[item.id] = item.defaultCount;
      });
      setRoomTypeConfig({
        ...roomTypeConfig,
        [roomTypeId]: initialConfig
      });
    }
  };
  
  const handleItemCountChange = (itemId: string, count: number) => {
    if (!selectedRoomType) return;
    
    setRoomTypeConfig({
      ...roomTypeConfig,
      [selectedRoomType]: {
        ...roomTypeConfig[selectedRoomType],
        [itemId]: count
      }
    });
  };
  
  const handleSaveRoomTypeConfig = () => {
    if (!selectedRoomType) {
      toast({
        title: "Error",
        description: "Please select a room type",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically save this configuration to your backend
    console.log("Saving room type configuration:", {
      roomTypeId: selectedRoomType,
      config: roomTypeConfig[selectedRoomType]
    });
    
    toast({
      title: "Success",
      description: "Room type configuration saved successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minibar Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="items">Minibar Items</TabsTrigger>
            <TabsTrigger value="roomTypes">Room Type Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Minibar Items</h3>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Default Count</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {miniBarItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.defaultCount}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {miniBarItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No minibar items found. Add some items to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="roomTypes" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label htmlFor="roomType" className="text-sm font-medium">Room Type</label>
                <Select value={selectedRoomType} onValueChange={handleRoomTypeSelect}>
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Select a room type" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((roomType) => (
                      <SelectItem key={roomType.id} value={roomType.id}>{roomType.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedRoomType && roomTypeConfig[selectedRoomType] && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Configure Minibar Items for {roomTypes.find(rt => rt.id === selectedRoomType)?.name}</h3>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Default Count</TableHead>
                        <TableHead>Count for this Room Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {miniBarItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="font-medium">{item.name}</div>
                            {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.defaultCount}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={roomTypeConfig[selectedRoomType][item.id] || 0}
                              onChange={(e) => handleItemCountChange(item.id, parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveRoomTypeConfig}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </Button>
                  </div>
                </div>
              )}
              
              {(!selectedRoomType || !roomTypeConfig[selectedRoomType]) && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Select a room type to configure minibar items.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem ? 'Edit Minibar Item' : 'Add Minibar Item'}</DialogTitle>
              <DialogDescription>
                {selectedItem ? 'Update the details of this minibar item.' : 'Add a new item to the minibar inventory.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Item description"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Soft Drinks">Soft Drinks</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Alcoholic Beverages">Alcoholic Beverages</SelectItem>
                    <SelectItem value="Snacks">Snacks</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="defaultCount" className="text-sm font-medium">Default Count</label>
                  <Input
                    id="defaultCount"
                    type="number"
                    min="0"
                    value={defaultCount}
                    onChange={(e) => setDefaultCount(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveItem}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
