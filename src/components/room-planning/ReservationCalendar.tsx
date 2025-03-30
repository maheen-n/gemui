
import React, { useState } from 'react';
import { addDays, format, isBefore, isAfter, startOfToday, eachDayOfInterval } from 'date-fns';
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
  
  const handlePreviousWeek = () => {
    setStartDate(addDays(startDate, -7));
  };
  
  const handleNextWeek = () => {
    setStartDate(addDays(startDate, 7));
  };
  
  const handleReservationClick = (reservation: Reservation) => {
    // Only allow interaction for current and future reservations
    if (!isBefore(new Date(reservation.checkIn), today)) {
      setSelectedReservation(reservation);
      setShowModal(true);
    }
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

  // Function to get reservation cell style based on its status
  const getReservationStyle = (reservation: Reservation, date: Date) => {
    const checkIn = new Date(reservation.checkIn);
    const checkOut = new Date(reservation.checkOut);
    
    if (date >= checkIn && date < checkOut) {
      const isPast = isBefore(date, today);
      const isFirstDay = date.getDate() === checkIn.getDate() && 
                         date.getMonth() === checkIn.getMonth() && 
                         date.getFullYear() === checkIn.getFullYear();
      const isLastDay = date.getDate() === new Date(addDays(checkOut, -1)).getDate() && 
                        date.getMonth() === new Date(addDays(checkOut, -1)).getMonth() && 
                        date.getFullYear() === new Date(addDays(checkOut, -1)).getFullYear();
      
      return {
        opacity: isPast ? 0.5 : 1,
        backgroundColor: reservation.roomNumber ? 'var(--primary)' : 'var(--accent)',
        color: reservation.roomNumber ? 'var(--primary-foreground)' : 'var(--accent-foreground)',
        borderRadius: isFirstDay && isLastDay ? 'var(--radius)' : 
                     isFirstDay ? 'var(--radius) 0 0 var(--radius)' : 
                     isLastDay ? '0 var(--radius) var(--radius) 0' : '0',
        cursor: isPast ? 'default' : 'pointer',
      };
    }
    
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {format(startDate, 'MMMM d, yyyy')} - {format(addDays(startDate, 13), 'MMMM d, yyyy')}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-14 min-w-[800px]" style={{ gridTemplateColumns: 'repeat(14, minmax(80px, 1fr))' }}>
          {/* Calendar header with dates */}
          {dates.map((date, i) => (
            <div 
              key={i} 
              className={`p-2 text-center border-b-2 font-medium ${
                isBefore(date, today) ? 'text-muted-foreground' : ''
              } ${
                format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') ? 'border-primary' : 'border-border'
              }`}
            >
              <div>{format(date, 'EEE')}</div>
              <div className="text-sm">{format(date, 'MMM d')}</div>
            </div>
          ))}
          
          {/* Placeholder for when no reservations match filter */}
          {reservations.length === 0 && (
            <div className="col-span-14 py-8 text-center text-muted-foreground">
              No reservations found for the selected filter.
            </div>
          )}
          
          {/* Reservations grid */}
          {reservations.map(reservation => {
            const reservationDates = eachDayOfInterval({
              start: new Date(reservation.checkIn),
              end: addDays(new Date(reservation.checkOut), -1)
            });
            
            // Skip reservations completely outside the visible date range
            const hasVisibleDates = reservationDates.some(date => 
              !isBefore(date, startDate) && !isAfter(date, addDays(startDate, 13))
            );
            
            if (!hasVisibleDates) return null;
            
            const roomType = roomTypes.find(rt => rt.id === reservation.roomTypeId);
            
            return (
              <div key={reservation.id} className="col-span-14 mt-2 flex">
                <div className="flex items-center justify-between p-2 bg-card border min-w-[200px] mr-1 rounded-md">
                  <div>
                    <div className="font-medium">{reservation.guestName}</div>
                    <div className="text-xs text-muted-foreground">
                      {reservation.reservationNumber} • {reservation.pax} pax • {roomType?.name}
                    </div>
                  </div>
                </div>
                
                {/* Reservation cells for each date */}
                <div className="flex-1 grid grid-cols-14" style={{ gridTemplateColumns: 'repeat(14, 1fr)' }}>
                  {dates.map((date, i) => {
                    const style = getReservationStyle(reservation, date);
                    
                    if (!style) {
                      return <div key={i} className="border-r border-border last:border-r-0" />;
                    }
                    
                    return (
                      <div
                        key={i}
                        className="border-r border-border last:border-r-0 h-full"
                        style={{ backgroundColor: style.backgroundColor }}
                      >
                        <div
                          className="h-full flex items-center justify-center p-1 text-xs font-medium transition-opacity hover:opacity-90"
                          style={{
                            color: style.color,
                            borderRadius: style.borderRadius,
                            cursor: style.cursor,
                            opacity: style.opacity
                          }}
                          onClick={() => style.cursor !== 'default' && handleReservationClick(reservation)}
                        >
                          {reservation.roomNumber}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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
