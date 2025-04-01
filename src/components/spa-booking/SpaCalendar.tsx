
import React, { useState } from 'react';
import { format, addDays, eachHourOfInterval, startOfDay, endOfDay, isSameDay, parseISO, addMinutes, isBefore, isAfter, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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

  // Handle navigation between days
  const handlePrevDay = () => {
    onDateChange(addDays(selectedDate, -1));
  };
  
  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
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
                    "text-center font-medium mb-1 p-1 rounded",
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
                        <div key={index} className="text-xs p-1 bg-gray-100 rounded">
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
      </div>
    );
  };

  const renderMonthView = () => {
    return (
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
