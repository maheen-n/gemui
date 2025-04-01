
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format, addDays, startOfToday, startOfWeek, addMinutes, parseISO, isWithinInterval, isSameDay } from 'date-fns';
import { SpaService, SpaServiceDuration } from '@/types';
import SpaCalendar from '@/components/spa-booking/SpaCalendar';
import ServiceSelection from '@/components/spa-booking/ServiceSelection';
import BookingForm from '@/components/spa-booking/BookingForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Users } from 'lucide-react';

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
    const endTime = addMinutes(bookingDate, duration.minutes).toISOString();
    
    bookings.push({
      id: `booking-${i + 1}`,
      guestId: `guest-${Math.floor(Math.random() * 100) + 1}`,
      guestName: ['James Wilson', 'Emma Thompson', 'Michael Brown', 'Olivia Garcia', 'Sophia Martinez'][Math.floor(Math.random() * 5)],
      serviceId: service.id,
      serviceName: service.name,
      durationId: duration.id,
      durationMinutes: duration.minutes,
      startTime,
      endTime,
      status: ['booked', 'completed'][Math.floor(Math.random() * 2)] as 'booked' | 'completed',
      therapistId: `therapist-${Math.floor(Math.random() * 5) + 1}`,
      therapistName: ['John Doe', 'Jane Smith', 'David Johnson', 'Sarah Williams', 'Robert Chen'][Math.floor(Math.random() * 5)],
      roomId: `room-${Math.floor(Math.random() * 5) + 1}`,
      createdAt: addDays(new Date(startTime), -3).toISOString()
    });
  }
  
  return bookings;
};

// Import the type to avoid naming conflict with the component
import type { SpaBooking as SpaBookingType } from '@/types';

const existingBookings = generateDemoBookings();

const SpaBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<SpaServiceDuration | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'couples'>('all');
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
  
  // Filter bookings for the selected date
  const filteredBookings = existingBookings.filter(booking => {
    return calendarView === 'day' 
      ? isSameDay(parseISO(booking.startTime), selectedDate)
      : isWithinInterval(parseISO(booking.startTime), {
          start: startOfWeek(selectedDate),
          end: addDays(startOfWeek(selectedDate), 6)
        });
  });

  // Handle service selection
  const handleServiceSelect = (service: SpaService) => {
    setSelectedService(service);
    setSelectedDuration(null);
    setSelectedTimeSlot(null);
  };

  // Handle duration selection
  const handleDurationSelect = (duration: SpaServiceDuration) => {
    setSelectedDuration(duration);
    setSelectedTimeSlot(null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Spa Booking Management</h1>
          <p className="text-muted-foreground mt-2">
            Book spa services for guests based on availability and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Service Selection */}
          <div className="space-y-6 md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Guest & Service Details
                </CardTitle>
                <CardDescription>
                  Select a service and duration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServiceSelection 
                  services={spaServices}
                  selectedService={selectedService}
                  selectedDuration={selectedDuration}
                  genderFilter={genderFilter}
                  onServiceSelect={handleServiceSelect}
                  onDurationSelect={handleDurationSelect}
                  onGenderFilterChange={setGenderFilter}
                />
              </CardContent>
            </Card>

            {selectedService && selectedDuration && (
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <BookingForm 
                    service={selectedService}
                    duration={selectedDuration}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                    onSubmit={() => {
                      // Handle booking submission
                      console.log('Booking submitted');
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column - Calendar */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Spa Calendar
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Tabs value={calendarView} onValueChange={(value) => setCalendarView(value as 'day' | 'week' | 'month')}>
                      <TabsList className="grid grid-cols-3 w-[200px]">
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SpaCalendar 
                  bookings={filteredBookings}
                  services={spaServices}
                  selectedDate={selectedDate}
                  selectedService={selectedService}
                  selectedDuration={selectedDuration}
                  calendarView={calendarView}
                  onDateChange={handleDateChange}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  selectedTimeSlot={selectedTimeSlot}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom section - Booking Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Booking Status Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-400 mr-2"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span>Peak Hours</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-200 mr-2"></div>
                <span>Preparation Time</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SpaBookingPage;
