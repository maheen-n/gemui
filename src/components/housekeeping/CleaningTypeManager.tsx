
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CleaningType } from '@/types';
import { Edit2, PlusCircle, Save, Trash2 } from 'lucide-react';

// Mock data
const initialCleaningTypes: CleaningType[] = [
  { id: '1', name: 'Full Cleaning', description: 'Complete room cleaning and amenity refresh', amenityMultiplier: 1, estimatedDuration: 45 },
  { id: '2', name: 'Light Cleaning', description: 'Quick refresh with minimal amenity replenishment', amenityMultiplier: 0.5, estimatedDuration: 20 },
  { id: '3', name: 'Stay-over Service', description: 'Basic service for guests staying multiple nights', amenityMultiplier: 0.25, estimatedDuration: 15 },
  { id: '4', name: 'Checkout Service', description: 'Deep cleaning after guest checkout', amenityMultiplier: 1.1, estimatedDuration: 60 },
];

export const CleaningTypeManager = () => {
  const [cleaningTypes, setCleaningTypes] = useState<CleaningType[]>(initialCleaningTypes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CleaningType>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newType, setNewType] = useState<Partial<CleaningType>>({
    name: '',
    description: '',
    amenityMultiplier: 1,
    estimatedDuration: 30
  });

  const handleEditClick = (type: CleaningType) => {
    setEditingId(type.id);
    setEditForm({ ...type });
  };

  const handleSaveEdit = () => {
    if (!editingId || !editForm.name) return;

    setCleaningTypes(prev =>
      prev.map(type =>
        type.id === editingId
          ? { ...type, ...editForm }
          : type
      )
    );
    setEditingId(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleAddNew = () => {
    if (!newType.name) return;

    const id = String(Date.now());
    const newCleaningType: CleaningType = {
      id,
      name: newType.name,
      description: newType.description || '',
      amenityMultiplier: newType.amenityMultiplier || 1,
      estimatedDuration: newType.estimatedDuration || 30
    };

    setCleaningTypes([...cleaningTypes, newCleaningType]);
    setNewType({
      name: '',
      description: '',
      amenityMultiplier: 1,
      estimatedDuration: 30
    });
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    setCleaningTypes(prev => prev.filter(type => type.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Cleaning Types</CardTitle>
          <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isAddingNew && (
            <Card className="bg-accent/20">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Add New Cleaning Type</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="text-sm">Name</label>
                      <Input 
                        value={newType.name} 
                        onChange={(e) => setNewType({...newType, name: e.target.value})} 
                        placeholder="Cleaning type name"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Description</label>
                      <Input 
                        value={newType.description || ''} 
                        onChange={(e) => setNewType({...newType, description: e.target.value})}
                        placeholder="Description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm">Amenity Multiplier</label>
                        <Input 
                          type="number"
                          step="0.1"
                          value={newType.amenityMultiplier} 
                          onChange={(e) => setNewType({...newType, amenityMultiplier: parseFloat(e.target.value) || 1})}
                        />
                      </div>
                      <div>
                        <label className="text-sm">Estimated Duration (min)</label>
                        <Input 
                          type="number"
                          value={newType.estimatedDuration} 
                          onChange={(e) => setNewType({...newType, estimatedDuration: parseInt(e.target.value) || 30})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                    <Button onClick={handleAddNew}>Add Cleaning Type</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amenity Multiplier</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cleaningTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>
                    {editingId === type.id ? (
                      <Input 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    ) : (
                      <span className="font-medium">{type.name}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === type.id ? (
                      <Input 
                        value={editForm.description} 
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      />
                    ) : (
                      type.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === type.id ? (
                      <Input 
                        type="number"
                        step="0.1"
                        className="w-20" 
                        value={editForm.amenityMultiplier} 
                        onChange={(e) => setEditForm({...editForm, amenityMultiplier: parseFloat(e.target.value) || 0})}
                      />
                    ) : (
                      `x${type.amenityMultiplier}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === type.id ? (
                      <Input 
                        type="number"
                        className="w-20" 
                        value={editForm.estimatedDuration} 
                        onChange={(e) => setEditForm({...editForm, estimatedDuration: parseInt(e.target.value) || 0})}
                      />
                    ) : (
                      `${type.estimatedDuration} min`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === type.id ? (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditClick(type)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(type.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
