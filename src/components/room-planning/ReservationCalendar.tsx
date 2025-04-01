import React, { useState } from 'react';
import { addDays, format, isBefore, isAfter, startOfToday, eachDayOfInterval, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reservation, RoomType } from '@/types';
import RoomAssignmentModal from './RoomAssignmentModal';

interface ReservationCalendarProps {
  reservations: Reservation[];
  roomTypes: RoomType[];
  onAssignRoom: (reservationId: string, roomNumber: string) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ 
  reservations, 
  roomTypes,
  onAssignRoom
}) => {
  const today = startOfToday();
  const [startDate, setStartDate] = useState(today);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Generate array of dates to display (14 days from start date)
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startDate, i));
  
  const handlePreviousMonth = () => {
    setStartDate(prevDate => addDays(prevDate, -14));
  };
  
  const handleNextMonth = () => {
    setStartDate(prevDate => addDays(prevDate, 14));
  };
  
  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };
  
  const handleAssignRoom = (roomNumber: string) => {
    if (selectedReservation) {
      onAssignRoom(selectedReservation.id, roomNumber);
      handleCloseModal();
    }
  };

  // Group reservations by room type
  const reservationsByRoomType = roomTypes.reduce((acc, roomType) => {
    acc[roomType.id] = reservations.filter(res => res.roomTypeId === roomType.id);
    return acc;
  }, {} as Record<string, Reservation[]>);

  return (
    <div className="overflow-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {format(startDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative overflow-x-auto border rounded-md">
        <table className="w-full">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background border-r min-w-[180px] p-2">Room Type</th>
              {dates.map((date, i) => (
                <th key={i} className={`p-2 text-center border-r font-medium text-sm ${
                  isBefore(date, today) ? 'text-muted-foreground' : ''
                } ${
                  format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? 'bg-accent/30' : ''
                }`}>
                  <div className="whitespace-nowrap">
                    {i === 0 && format(date, 'MMM')} {format(date, 'd')}
                  </div>
                  <div className="text-xs text-muted-foreground">{format(date, 'EEE')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roomTypes.map(roomType => (
              <tr key={roomType.id} className="border-t">
                <td className="sticky left-0 z-10 bg-background border-r p-3 font-medium">
                  {roomType.name}
                </td>
                {dates.map((date, dateIndex) => {
                  const dayReservations = reservationsByRoomType[roomType.id]?.filter(res => {
                    const checkIn = new Date(res.checkIn);
                    const checkOut = new Date(res.checkOut);
                    return date >= checkIn && date < checkOut;
                  }) || [];

                  return (
                    <td key={dateIndex} className="border-r p-0 relative min-w-[100px]" style={{ height: Math.max(64, dayReservations.length * 24) + 'px' }}>
                      <div className="absolute inset-0 overflow-y-auto max-h-[200px] p-1">
                        {dayReservations.map((reservation, resIndex) => (
                          <div 
                            key={`${reservation.id}-${dateIndex}`}
                            onClick={() => handleReservationClick(reservation)}
                            className={`mb-1 flex items-center px-2 py-1 text-xs 
                              ${reservation.roomNumber ? 'bg-cyan-600 text-white' : 'bg-gray-500 text-white'} 
                              ${isBefore(date, today) ? 'opacity-60' : 'cursor-pointer hover:opacity-90'} 
                              rounded`}
                          >
                            {reservation.guestName}
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Room assignment modal */}
      {selectedReservation && (
        <RoomAssignmentModal
          isOpen={showModal}
          onClose={handleCloseModal}
          reservation={selectedReservation}
          roomType={roomTypes.find(rt => rt.id === selectedReservation.roomTypeId)}
          onAssignRoom={handleAssignRoom}
        />
      )}
    </div>
  );
};

export default ReservationCalendar;
