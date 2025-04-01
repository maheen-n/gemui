
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format, addDays, startOfToday, parseISO, isSameDay } from 'date-fns';
import { SpaService, SpaServiceDuration, SpaBooking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Flower2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SpaBookingModal from '@/components/spa-booking/SpaBookingModal';

// Demo data - Spa Services
const spaServices: SpaService[] = [
  {
    id: '1',
    name: 'Herbal Body Wrap',
    description: 'A therapeutic treatment that uses herbal infusions to detoxify and rejuvenate the skin.',
    durations: [
      { id: '1-1', minutes: 60, price: 120 },
      { id: '1-2', minutes: 90, price: 160 }
    ],
    genderCriteria: 'all',
    preparationTime: 15,
    category: 'Body Treatments'
  },
  {
    id: '2',
    name: 'Navara De-tan Facial',
    description: 'A specialized facial treatment to remove tan and brighten the skin using natural ingredients.',
    durations: [
      { id: '2-1', minutes: 30, price: 70 },
      { id: '2-2', minutes: 60, price: 120 }
    ],
    genderCriteria: 'all',
    preparationTime: 10,
    category: 'Facials'
  },
  {
    id: '3',
    name: 'Deep Tissue Massage',
    description: 'A therapeutic massage targeting the deep layers of muscle and fascia.',
    durations: [
      { id: '3-1', minutes: 60, price: 100 },
      { id: '3-2', minutes: 90, price: 150 },
      { id: '3-3', minutes: 120, price: 180 }
    ],
    genderCriteria: 'all',
    preparationTime: 15,
    category: 'Massages'
  },
  {
    id: '4',
    name: 'Couple\'s Aromatherapy',
    description: 'A relaxing aromatherapy massage experience for couples.',
    durations: [
      { id: '4-1', minutes: 60, price: 200 },
      { id: '4-2', minutes: 90, price: 280 }
    ],
    genderCriteria: 'couples',
    preparationTime: 20,
    category: 'Couple Treatments'
  },
  {
    id: '5',
    name: 'Men\'s Grooming Facial',
    description: 'A facial treatment designed specifically for men\'s skin needs.',
    durations: [
      { id: '5-1', minutes: 45, price: 80 },
      { id: '5-2', minutes: 60, price: 110 }
    ],
    genderCriteria: 'male',
    preparationTime: 10,
    category: 'Men\'s Treatments'
  },
  {
    id: '6',
    name: 'Women\'s Relaxation Package',
    description: 'A comprehensive relaxation package including massage and facial.',
    durations: [
      { id: '6-1', minutes: 120, price: 220 },
      { id: '6-2', minutes: 180, price: 300 }
    ],
    genderCriteria: 'female',
    preparationTime: 20,
    category: 'Women\'s Treatments'
  },
];

// Demo data - Existing Bookings
const generateDemoBookings = (): SpaBooking[] => {
  const today = startOfToday();
  const bookings: SpaBooking[] = [];
  
  // Generate some bookings for the next 7 days
  for (let i = 0; i < 20; i++) {
    const randomServiceIndex = Math.floor(Math.random() * spaServices.length);
    const service = spaServices[randomServiceIndex];
    
    const randomDurationIndex = Math.floor(Math.random() * service.durations.length);
    const duration = service.durations[randomDurationIndex];
    
    const dayOffset = Math.floor(Math.random() * 7); // 0-6 days ahead
    const bookingDate = addDays(today, dayOffset);
    
    // Random hour between 9 AM and 6 PM
    const hours = 9 + Math.floor(Math.random() * 9);
    const minutes = Math.random() > 0.5 ? 30 : 0;
    
    bookingDate.setHours(hours, minutes, 0, 0);
    
    const startTime = bookingDate.toISOString();
    const endTime = addDays(new Date(startTime), 0);
    endTime.setHours(hours);
    endTime.setMinutes(minutes + duration.minutes);
    
    bookings.push({
      id: `booking-${i + 1}`,
      guestId: `guest-${Math.floor(Math.random() * 100) + 1}`,
      guestName: ['James Wilson', 'Emma Thompson', 'Michael Brown', 'Olivia Garcia', 'Sophia Martinez'][Math.floor(Math.random() * 5)],
      serviceId: service.id,
      serviceName: service.name,
      durationId: duration.id,
      durationMinutes: duration.minutes,
      startTime,
      endTime: endTime.toISOString(),
      status: ['booked', 'completed'][Math.floor(Math.random() * 2)] as 'booked' | 'completed',
      therapistId: `therapist-${Math.floor(Math.random() * 5) + 1}`,
      therapistName: ['John Doe', 'Jane Smith', 'David Johnson', 'Sarah Williams', 'Robert Chen'][Math.floor(Math.random() * 5)],
      roomId: `room-${Math.floor(Math.random() * 5) + 1}`,
      createdAt: addDays(new Date(startTime), -3).toISOString()
    });
  }
  
  return bookings;
};

const existingBookings = generateDemoBookings();

// Generate available time slots for the selected service and date
const generateAvailableSlots = (
  date: Date, 
  service: SpaService | null, 
  duration: SpaServiceDuration | null, 
  bookings: SpaBooking[]
) => {
  if (!service || !duration) return [];
  
  const slots = [];
  const START_HOUR = 9; // 9 AM
  const END_HOUR = 18;  // 6 PM
  
  for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
    for (let minute of [0, 30]) {
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);
      
      // Skip if the slot is in the past
      if (slotTime < new Date()) continue;
      
      // Check if this slot conflicts with any booking
      const slotEnd = new Date(slotTime);
      slotEnd.setMinutes(slotTime.getMinutes() + duration.minutes);
      
      const isBooked = bookings.some(booking => {
        const bookingStart = parseISO(booking.startTime);
        const bookingEnd = parseISO(booking.endTime);
        
        return (
          (slotTime >= bookingStart && slotTime < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotTime <= bookingStart && slotEnd >= bookingEnd)
        );
      });
      
      if (!isBooked) {
        slots.push({
          time: slotTime.toISOString(),
          endTime: slotEnd.toISOString(),
          formattedTime: format(slotTime, 'h:mm a')
        });
      }
    }
  }
  
  return slots;
};

const SpaBookingPage = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<SpaServiceDuration | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Filter bookings for the selected date
  const filteredBookings = existingBookings.filter(booking => 
    isSameDay(parseISO(booking.startTime), selectedDate)
  );

  // Filter services by category
  const filteredServices = spaServices.filter(service => 
    activeCategory === "all" || service.category === activeCategory
  );
  
  // Get available slots for the selected date and service
  const availableSlots = generateAvailableSlots(
    selectedDate, 
    selectedService, 
    selectedDuration, 
    filteredBookings
  );

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setIsBookingModalOpen(true);
  };
  
  // Handle service selection
  const handleServiceSelect = (service: SpaService) => {
    setSelectedService(service);
    setSelectedDuration(service.durations[0]); // Default to first duration
  };

  // Handle duration selection
  const handleDurationSelect = (duration: SpaServiceDuration) => {
    setSelectedDuration(duration);
  };
  
  // Handle booking submission
  const handleBookingSubmit = (bookingData: any) => {
    toast({
      title: "Booking successful!",
      description: `${bookingData.serviceName} booked for ${bookingData.guestName} on ${format(selectedDate, 'MMMM d, yyyy')} at ${format(parseISO(selectedTimeSlot!), 'h:mm a')}`,
    });
    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
  };

  // Navigation between days
  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };
  
  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };
  
  // Get unique categories
  const categories = ["all", ...Array.from(new Set(spaServices.map(service => service.category)))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spa Booking Management</h1>
          <p className="text-muted-foreground mt-2">
            Book spa services for guests based on availability
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column - Service Selection */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-lg font-medium">Spa Services</CardTitle>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <div className="border-t">
                  <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
                    <div className="px-4 py-2 bg-muted/50">
                      <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="Massages">Massage</TabsTrigger>
                        <TabsTrigger value="Facials">Facial</TabsTrigger>
                      </TabsList>
                    </div>
                    <div className="divide-y">
                      {filteredServices.map(service => (
                        <div 
                          key={service.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 ${selectedService?.id === service.id ? 'bg-muted/70 border-l-4 border-primary' : ''}`}
                          onClick={() => handleServiceSelect(service)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium">{service.name}</div>
                            <Badge variant="outline" className="ml-2">
                              {service.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {service.durations.map(duration => (
                              <Badge 
                                key={duration.id}
                                variant={selectedService?.id === service.id && selectedDuration?.id === duration.id ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleServiceSelect(service);
                                  handleDurationSelect(duration);
                                }}
                              >
                                {duration.minutes} min - ${duration.price}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Calendar and Slots */}
          <div className="lg:col-span-9">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>
                    {selectedService ? (
                      <div className="flex items-center">
                        <span>{selectedService.name}</span>
                        {selectedDuration && (
                          <Badge variant="outline" className="ml-2">
                            {selectedDuration.minutes} min - ${selectedDuration.price}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span>Available Time Slots</span>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePrevDay}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium whitespace-nowrap">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNextDay}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div className="border rounded-md p-3">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      className="pointer-events-auto"
                      initialFocus
                    />
                  </div>
                  
                  {/* Available Slots */}
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-3">Available Slots</h3>
                    {selectedService && selectedDuration ? (
                      availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {availableSlots.map((slot, index) => (
                            <Button
                              key={index}
                              variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                              className="h-auto py-2"
                              onClick={() => handleTimeSlotSelect(slot.time)}
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {slot.formattedTime}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No available slots for this service on the selected date.
                        </div>
                      )
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Select a service and duration to view available slots.
                      </div>
                    )}
                  </div>
                </div>

                {/* Today's Bookings */}
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Bookings for {format(selectedDate, 'MMMM d, yyyy')}</h3>
                  {filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredBookings
                        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                        .map((booking, index) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="font-medium">{booking.serviceName}</div>
                            <div className="text-sm text-muted-foreground">
                              {booking.guestName}
                            </div>
                            <div className="flex items-center mt-1 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
                            </div>
                            <Badge className="mt-2" variant={booking.status === 'booked' ? 'outline' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        ))
                    }
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground border rounded-md">
                      No bookings for this day.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {isBookingModalOpen && selectedService && selectedDuration && selectedTimeSlot && (
        <SpaBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          service={selectedService}
          duration={selectedDuration}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSubmit={handleBookingSubmit}
        />
      )}
    </DashboardLayout>
  );
};

export default SpaBookingPage;
