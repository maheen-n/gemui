
import React from 'react';
import { RoomType } from '@/types';
import { Button } from '@/components/ui/button';
import { BedDouble, Users } from 'lucide-react';

interface RoomTypeListProps {
  roomTypes: RoomType[];
  selectedRoomTypeId: string | null;
  onSelectRoomType: (id: string) => void;
}

const RoomTypeList: React.FC<RoomTypeListProps> = ({ 
  roomTypes, 
  selectedRoomTypeId, 
  onSelectRoomType 
}) => {
  return (
    <div className="space-y-2">
      <Button
        variant={selectedRoomTypeId === null ? "default" : "outline"}
        className="w-full justify-start gap-3 h-auto py-3 px-4"
        onClick={() => onSelectRoomType(selectedRoomTypeId || 'all')}
      >
        <BedDouble className="h-5 w-5 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="font-medium">All Rooms</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Users className="h-3 w-3" />
            {roomTypes.reduce((total, rt) => total + rt.count, 0)} rooms
          </span>
        </div>
      </Button>
      
      {roomTypes.map((roomType) => (
        <Button
          key={roomType.id}
          variant={selectedRoomTypeId === roomType.id ? "default" : "outline"}
          className="w-full justify-start gap-3 h-auto py-3 px-4"
          onClick={() => onSelectRoomType(roomType.id)}
        >
          <BedDouble className="h-5 w-5 flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="font-medium">{roomType.name}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Users className="h-3 w-3" />
              {roomType.capacity} pax • {roomType.count} rooms
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default RoomTypeList;
