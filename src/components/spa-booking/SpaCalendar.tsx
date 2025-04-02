
import React, { useState } from 'react';
import { format, addDays, eachHourOfInterval, startOfDay, endOfDay, isSameDay, parseISO, addMinutes, isBefore, isAfter, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpaBooking, SpaService, SpaServiceDuration } from '@/types';

interface SpaCalendarProps {
  bookings: SpaBooking[];
  services: SpaService[];
  selectedDate: Date;
  selectedService: SpaService | null;
  selectedDuration: SpaServiceDuration | null;
  calendarView: 'day' | 'week' | 'month';
  onDateChange: (date: Date | undefined) => void;
  onTimeSlotSelect: (timeSlot: string) => void;
  selectedTimeSlot: string | null;
}

const SpaCalendar: React.FC<SpaCalendarProps> = ({
  bookings,
  services,
  selectedDate,
  selectedService,
  selectedDuration,
  calendarView,
  onDateChange,
  onTimeSlotSelect,
  selectedTimeSlot
}) => {
  // Business hours: 9 AM to 7 PM
  const START_HOUR = 9;
  const END_HOUR = 19;
  const PEAK_HOURS = [10, 11, 16, 17]; // 10 AM - 12 PM and 4 PM - 6 PM are peak hours
  
  // Generate time slots for the selected day
  const generateTimeSlots = (date: Date, service: SpaService | null, duration: SpaServiceDuration | null) => {
    if (!service || !duration) return [];
    
    const slots = [];
    const dayStart = new Date(date);
    dayStart.setHours(START_HOUR, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(END_HOUR, 0, 0, 0);
    
    // Generate slots at 30-minute intervals
    for (let time = dayStart; time < dayEnd; time = addMinutes(time, 30)) {
      const slotEnd = addMinutes(time, duration.minutes);
      
      // Skip if the slot goes beyond business hours
      if (isAfter(slotEnd, dayEnd)) continue;
      
      // Check if the slot overlaps with any existing booking
      const isOverlapping = bookings.some(booking => {
        const bookingStart = parseISO(booking.startTime);
        const bookingEnd = parseISO(booking.endTime);
        
        // Include preparation time after the booking
        const bookingEndWithPrep = addMinutes(
          bookingEnd, 
          services.find(s => s.id === booking.serviceId)?.preparationTime || 0
        );
        
        return (
          (isAfter(time, bookingStart) && isBefore(time, bookingEndWithPrep)) ||
          (isAfter(slotEnd, bookingStart) && isBefore(slotEnd, bookingEndWithPrep)) ||
          (isBefore(time, bookingStart) && isAfter(slotEnd, bookingEndWithPrep)) ||
          isSameDay(time, bookingStart) && time.getHours() === bookingStart.getHours() && time.getMinutes() === bookingStart.getMinutes()
        );
      });
      
      if (!isOverlapping) {
        slots.push({
          startTime: time.toISOString(),
          endTime: slotEnd.toISOString(),
          isPeakHour: PEAK_HOURS.includes(time.getHours())
        });
      }
    }
    
    return slots;
  };
  
  const timeSlots = generateTimeSlots(selectedDate, selectedService, selectedDuration);
  
  // State for booking details popover
  const [selectedBooking, setSelectedBooking] = useState<SpaBooking | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Handle navigation between days
  const handlePrevDay = () => {
    onDateChange(addDays(selectedDate, -1));
  };
  
  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  // Handle booking click
  const handleBookingClick = (booking: SpaBooking) => {
    setSelectedBooking(booking);
    setIsPopoverOpen(true);
  };

  const renderDayView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={handlePrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <Button variant="outline" size="sm" onClick={handleNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {selectedService && selectedDuration ? (
            <>
              <div className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  {selectedService.name}
                </Badge>
                <Badge variant="outline">
                  {selectedDuration.minutes} min - ${selectedDuration.price}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot, index) => {
                    const startTime = parseISO(slot.startTime);
                    return (
                      <Button
                        key={index}
                        variant={selectedTimeSlot === slot.startTime ? "default" : "outline"}
                        className={cn(
                          "h-auto py-2",
                          slot.isPeakHour && "border-yellow-400",
                          selectedTimeSlot === slot.startTime && "bg-primary"
                        )}
                        onClick={() => onTimeSlotSelect(slot.startTime)}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-sm">{format(startTime, 'h:mm a')}</span>
                          {slot.isPeakHour && (
                            <Badge variant="outline" className="mt-1 text-xs border-yellow-400">
                              Peak
                            </Badge>
                          )}
                        </div>
                      </Button>
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center py-4 text-muted-foreground">
                    No available time slots for the selected service and duration on this day.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Select a service and duration to view available time slots.
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Today's Bookings</h4>
          <div className="space-y-2">
            {bookings.filter(booking => isSameDay(parseISO(booking.startTime), selectedDate)).length > 0 ? (
              bookings
                .filter(booking => isSameDay(parseISO(booking.startTime), selectedDate))
                .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
                .map((booking, index) => (
                  <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                    <div>
                      <div className="font-medium">{booking.serviceName}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.guestName} • {booking.durationMinutes} min
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No bookings for this day.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(weekStart, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            Week of {format(weekStart, 'MMMM d, yyyy')}
          </h3>
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(weekStart, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const day = addDays(weekStart, dayIndex);
            const dayBookings = bookings.filter(booking => isSameDay(parseISO(booking.startTime), day));
            
            return (
              <div key={dayIndex} className="border rounded-md p-2">
                <div 
                  className={cn(
                    "text-center font-medium mb-1 p-1 rounded cursor-pointer hover:bg-accent",
                    isSameDay(day, new Date()) && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => onDateChange(day)}
                >
                  <div>{format(day, 'EEE')}</div>
                  <div>{format(day, 'd')}</div>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {dayBookings.length > 0 ? (
                    dayBookings
                      .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
                      .slice(0, 3)
                      .map((booking, index) => (
                        <div 
                          key={index} 
                          className="text-xs p-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookingClick(booking);
                          }}
                        >
                          <div className="truncate">{format(parseISO(booking.startTime), 'h:mm a')}</div>
                          <div className="truncate font-medium">{booking.serviceName}</div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center text-xs text-muted-foreground">No bookings</div>
                  )}
                  {dayBookings.length > 3 && (
                    <div className="text-center text-xs text-muted-foreground">
                      +{dayBookings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Booking details popover */}
        {selectedBooking && isPopoverOpen && (
          <div 
            className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
            onClick={() => setIsPopoverOpen(false)}
          >
            <div 
              className="bg-white rounded-lg p-4 shadow-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold">{selectedBooking.serviceName}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => setIsPopoverOpen(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Guest:</span>
                  <span className="font-medium">{selectedBooking.guestName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{format(parseISO(selectedBooking.startTime), 'MMM d, h:mm a')} - {format(parseISO(selectedBooking.endTime), 'h:mm a')}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{selectedBooking.durationMinutes} minutes</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Therapist:</span>
                  <span>{selectedBooking.therapistName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge 
                    variant={selectedBooking.status === 'completed' ? 'outline' : 'default'}
                    className={selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  >
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMonthView = () => {
    const todayBookings = bookings.filter(booking => 
      isSameDay(parseISO(booking.startTime), selectedDate)
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            className="rounded-md border w-full"
            initialFocus
            // Shows dots under days with bookings
            modifiers={{
              booked: bookings.map(booking => parseISO(booking.startTime)),
            }}
            modifiersStyles={{
              booked: { 
                fontWeight: 'bold',
                textDecoration: 'underline', 
                textDecorationColor: 'var(--primary)',
                textDecorationThickness: '2px'
              },
            }}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">
            Bookings for {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          <div className="space-y-2">
            {todayBookings.length > 0 ? (
              todayBookings
                .sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime())
                .map((booking, index) => (
                  <div 
                    key={index} 
                    className="p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-accent/10"
                    onClick={() => handleBookingClick(booking)}
                  >
                    <div>
                      <div className="font-medium">{booking.serviceName}</div>
                      <div className="text-sm text-muted-foreground">
                        {booking.guestName} • {booking.durationMinutes} min
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">
                        {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                      </span>
                      <Button variant="ghost" size="icon" className="ml-1 h-6 w-6">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8 border rounded-md text-muted-foreground">
                No bookings for {format(selectedDate, 'MMMM d, yyyy')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {calendarView === 'day' && renderDayView()}
      {calendarView === 'week' && renderWeekView()}
      {calendarView === 'month' && renderMonthView()}
    </div>
  );
};

export default SpaCalendar;
