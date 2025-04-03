import React, { useState } from 'react';
import { type DayContentProps } from 'react-day-picker';
import { 
  format, 
  addDays, 
  eachHourOfInterval, 
  startOfDay, 
  endOfDay, 
  isSameDay, 
  parseISO, 
  addMinutes, 
  isBefore, 
  isAfter, 
  startOfWeek, 
  endOfWeek, 
  isWithinInterval,
  getDay 
} from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Info, Edit, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SpaBooking, SpaService, SpaServiceDuration } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SpaCalendarViewProps {
  bookings: SpaBooking[];
  services: SpaService[];
  selectedDate: Date;
  selectedService: SpaService | null;
  selectedDuration: SpaServiceDuration | null;
  calendarView: 'day' | 'week' | 'month';
  onDateChange: (date: Date | undefined) => void;
  onTimeSlotSelect: (timeSlot: string) => void;
}

const SpaCalendarView: React.FC<SpaCalendarViewProps> = ({
  bookings,
  services,
  selectedDate,
  selectedService,
  selectedDuration,
  calendarView,
  onDateChange,
  onTimeSlotSelect
}) => {
  const [selectedBooking, setSelectedBooking] = useState<SpaBooking | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const START_HOUR = 9;
  const END_HOUR = 19;
  const PEAK_HOURS = [10, 11, 16, 17]; // 10 AM - 12 PM and 4 PM - 6 PM are peak hours
  
  const generateTimeSlots = (date: Date, service: SpaService | null, duration: SpaServiceDuration | null) => {
    if (!service || !duration) return [];
    
    const slots = [];
    const dayStart = new Date(date);
    dayStart.setHours(START_HOUR, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(END_HOUR, 0, 0, 0);
    
    for (let time = dayStart; time < dayEnd; time = addMinutes(time, 30)) {
      const slotEnd = addMinutes(time, duration.minutes);
      
      if (isAfter(slotEnd, dayEnd)) continue;
      
      const isOverlapping = bookings.some(booking => {
        const bookingStart = parseISO(booking.startTime);
        const bookingEnd = parseISO(booking.endTime);
        
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

  const handlePrevDay = () => {
    onDateChange(addDays(selectedDate, -1));
  };
  
  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleBookingClick = (booking: SpaBooking) => {
    setSelectedBooking(booking);
    setIsPopoverOpen(true);
  };

  const handleEditBooking = (booking: SpaBooking) => {
    setIsPopoverOpen(false);
    setSelectedBooking(null);
    onTimeSlotSelect(booking.startTime);
  };

  const handleCloseBookingDetails = () => {
    setIsPopoverOpen(false);
    setSelectedBooking(null);
  };

  const renderBookingDetails = () => {
    if (!selectedBooking) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
        onClick={handleCloseBookingDetails}
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
              onClick={handleCloseBookingDetails}
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
                className={cn(
                  selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' : '',
                  selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-100' : '',
                  selectedBooking.status === 'no-show' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''
                )}
              >
                {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleCloseBookingDetails}
            >
              Close
            </Button>
            {selectedBooking.status === 'booked' && (
              <Button 
                variant="default"
                size="sm"
                onClick={() => handleEditBooking(selectedBooking)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const todayBookings = bookings.filter(booking => 
      isSameDay(parseISO(booking.startTime), selectedDate)
    ).sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());

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
              
              <ScrollArea className="h-60">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => {
                      const startTime = parseISO(slot.startTime);
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          className={cn(
                            "h-auto py-2",
                            slot.isPeakHour && "border-yellow-400",
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
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      No available time slots for the selected service and duration on this day.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Select a service and duration to view available time slots.
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Today's Bookings ({todayBookings.length})</h4>
          <ScrollArea className="h-64">
            <div className="space-y-2 p-1">
              {todayBookings.length > 0 ? (
                todayBookings.map((booking, index) => (
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
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "ml-2",
                          booking.status === 'completed' && "bg-green-100 text-green-800",
                          booking.status === 'cancelled' && "bg-red-100 text-red-800",
                          booking.status === 'no-show' && "bg-amber-100 text-amber-800"
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No bookings for this day.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const timeSlots = [];
    
    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      timeSlots.push(hour);
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(weekStart, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium">
            Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          <Button variant="outline" size="sm" onClick={() => onDateChange(addDays(weekStart, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="relative min-w-[800px]">
            <div className="grid grid-cols-8 gap-1 mb-2 sticky top-0 bg-background z-10">
              <div className="h-14 border-b font-medium pt-4 pr-4 text-right text-xs text-muted-foreground">
                Time
              </div>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = addDays(weekStart, dayIndex);
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                
                return (
                  <div 
                    key={dayIndex}
                    onClick={() => onDateChange(day)}
                    className={cn(
                      "h-14 border-b px-2 pt-2 text-center cursor-pointer",
                      isToday && "bg-accent/30",
                      isSelected && "border border-primary"
                    )}
                  >
                    <div className="font-medium text-sm">{dayNames[dayIndex]}</div>
                    <div className={cn(
                      "text-lg rounded-full w-8 h-8 mx-auto flex items-center justify-center mt-1",
                      isToday && "bg-primary text-primary-foreground",
                      isSelected && !isToday && "ring-1 ring-primary"
                    )}>
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-8 gap-1">
              {timeSlots.map((hour, hourIndex) => (
                <React.Fragment key={hourIndex}>
                  <div className="h-16 border-b border-r pr-2 text-right pt-2 text-xs text-muted-foreground">
                    {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
                  </div>
                  
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const day = addDays(weekStart, dayIndex);
                    const currentHourStart = new Date(day);
                    currentHourStart.setHours(hour, 0, 0, 0);
                    const currentHourEnd = new Date(day);
                    currentHourEnd.setHours(hour + 1, 0, 0, 0);
                    
                    const hourBookings = bookings.filter(booking => {
                      const bookingStart = parseISO(booking.startTime);
                      const bookingEnd = parseISO(booking.endTime);
                      
                      return (
                        isSameDay(bookingStart, day) && 
                        (
                          (bookingStart.getHours() === hour) ||
                          (bookingStart.getHours() < hour && bookingEnd.getHours() > hour) ||
                          (bookingEnd.getHours() === hour && bookingEnd.getMinutes() > 0)
                        )
                      );
                    });
                    
                    const isPeakHour = PEAK_HOURS.includes(hour);
                    
                    return (
                      <div 
                        key={`${hourIndex}-${dayIndex}`} 
                        className={cn(
                          "h-16 border-b relative group",
                          isPeakHour && "bg-yellow-50/30",
                          isSameDay(day, selectedDate) && "bg-accent/10"
                        )}
                        onClick={() => {
                          const timeSlot = new Date(day);
                          timeSlot.setHours(hour, 0, 0, 0);
                          onTimeSlotSelect(timeSlot.toISOString());
                        }}
                      >
                        {hourBookings.length > 0 ? (
                          <div className="absolute inset-0 p-1 flex flex-col gap-1 overflow-hidden">
                            {hourBookings.map((booking, idx) => {
                              const bookingStart = parseISO(booking.startTime);
                              const startMinutePercentage = bookingStart.getHours() === hour ? 
                                (bookingStart.getMinutes() / 60) * 100 : 0;
                              
                              const statusColor = booking.status === 'completed' ? 'bg-green-100 border-green-300' : 
                                                 booking.status === 'cancelled' ? 'bg-red-100 border-red-300' : 
                                                 booking.status === 'no-show' ? 'bg-amber-100 border-amber-300' : 
                                                 'bg-blue-100 border-blue-300';
                              
                              return (
                                <div
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBookingClick(booking);
                                  }}
                                  style={{ top: `${startMinutePercentage}%` }}
                                  className={cn(
                                    "absolute left-0 right-0 mx-1 px-1 py-0.5 text-xs truncate rounded border cursor-pointer",
                                    statusColor
                                  )}
                                >
                                  <div className="font-medium truncate">
                                    {format(bookingStart, 'h:mm')} {booking.serviceName}
                                  </div>
                                  <div className="truncate text-[10px]">
                                    {booking.guestName}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const timeSlot = new Date(day);
                              timeSlot.setHours(hour, 0, 0, 0);
                              onTimeSlotSelect(timeSlot.toISOString());
                            }}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-accent/30 transition-opacity"
                          >
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <Plus className="h-3 w-3 text-primary" />
                            </div>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderMonthView = () => {
    const todayBookings = bookings.filter(booking => 
      isSameDay(parseISO(booking.startTime), selectedDate)
    ).sort((a, b) => parseISO(a.startTime).getTime() - parseISO(b.startTime).getTime());
    
    const bookingDates = bookings.reduce((acc: Record<string, number>, booking) => {
      const dateStr = format(parseISO(booking.startTime), 'yyyy-MM-dd');
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {});

    const CustomDayContent = ({ date }: DayContentProps) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = bookingDates[dateStr] || 0;

      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div>{date.getDate()}</div>
          {count > 0 && (
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-primary">
              {count}
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            className="rounded-md border"
            initialFocus
            modifiers={{
              booked: Object.keys(bookingDates).map(dateStr => new Date(dateStr)),
            }}
            modifiersStyles={{
              booked: { 
                fontWeight: 'bold',
                textDecoration: 'underline', 
                textDecorationColor: 'var(--primary)',
                textDecorationThickness: '2px'
              },
            }}
            components={{
              DayContent: CustomDayContent
            }}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center justify-between">
            <span>Bookings for {format(selectedDate, 'MMMM d, yyyy')}</span>
            <Badge variant="outline">{todayBookings.length} bookings</Badge>
          </h3>
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {todayBookings.length > 0 ? (
                todayBookings.map((booking, index) => (
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
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                      </span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
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
          </ScrollArea>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {calendarView === 'day' && renderDayView()}
      {calendarView === 'week' && renderWeekView()}
      {calendarView === 'month' && renderMonthView()}
      {isPopoverOpen && renderBookingDetails()}
    </div>
  );
};

export default SpaCalendarView;
