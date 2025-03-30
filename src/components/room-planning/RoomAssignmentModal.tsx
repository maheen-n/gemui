import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BedDouble, Calendar, User, Users } from 'lucide-react';
import { Reservation, RoomType } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation;
  roomType: RoomType | undefined;
  onAssignRoom: (roomNumber: string) => void;
}

// Generate room numbers based on room type
const generateRoomNumbers = (roomType: RoomType | undefined): string[] => {
  if (!roomType) return [];
  
  const roomNumbers: string[] = [];
  
  // Different floor for each room type
  const floorNumber = parseInt(roomType.id);
  
  for (let i = 1; i <= roomType.count; i++) {
    const roomNumber = `${floorNumber}${i.toString().padStart(2, '0')}`;
    roomNumbers.push(roomNumber);
  }
  
  return roomNumbers;
};

const RoomAssignmentModal: React.FC<RoomAssignmentModalProps> = ({ 
  isOpen, 
  onClose, 
  reservation, 
  roomType,
  onAssignRoom 
}) => {
  const [selectedRoom, setSelectedRoom] = useState(reservation.roomNumber || '');
  const roomNumbers = generateRoomNumbers(roomType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoom) {
      onAssignRoom(selectedRoom);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Room</DialogTitle>
          <DialogDescription>
            Assign a room for this reservation
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-lg border p-4 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <h4 className="font-medium">{reservation.guestName}</h4>
                <p className="text-sm text-muted-foreground">{reservation.reservationNumber}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(new Date(reservation.checkIn), 'MMM d')} - {format(new Date(reservation.checkOut), 'MMM d, yyyy')}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{reservation.pax} guests</span>
              </div>
              
              <div className="flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-muted-foreground" />
                <span>{roomType?.name}</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room number" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomNumbers.map(room => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-room">Or enter custom room number</Label>
                <Input
                  id="custom-room"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  placeholder="e.g. 101"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedRoom}>
                Assign Room
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomAssignmentModal;
