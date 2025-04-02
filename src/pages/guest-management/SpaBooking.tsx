import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format, addDays, startOfToday, parseISO, isSameDay, addHours, startOfMonth, endOfMonth, differenceInDays } from 'date-fns';
import { SpaService, SpaServiceDuration, SpaBooking } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Flower2, Plus } from 'lucide-react';
import SpaServicesList from '@/components/spa-booking/SpaServicesList';
import SpaCalendarView from '@/components/spa-booking/SpaCalendarView';
import SpaBookingModal from '@/components/spa-booking/SpaBookingModal';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

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

// Guest names for demo data
const guestNames = [
  'James Wilson', 'Emma Thompson', 'Michael Brown', 'Olivia Garcia', 'William Davis', 
  'Sophia Martinez', 'Benjamin Johnson', 'Mia Rodriguez', 'Jacob Martinez', 'Charlotte Clark',
  'Amelia Lewis', 'Ethan Walker', 'Isabella Hall', 'Alexander White', 'Sophie Allen',
  'Daniel King', 'Ava Wright', 'Matthew Scott', 'Emily Adams', 'David Phillips'
];

// Therapist names for demo data
const therapistNames = [
  'John Doe', 'Jane Smith', 'David Johnson', 'Sarah Williams', 'Robert Chen',
  'Maria Rodriguez', 'Thomas Moore', 'Lisa Garcia', 'Michael Taylor', 'Amanda Lee'
];

// Room IDs for demo data
const roomIds = ['room-1', 'room-2', 'room-3', 'room-4', 'room-5'];

// Demo data - Comprehensive Bookings for the whole month
const generateDemoBookings = (): SpaBooking[] => {
  const today = startOfToday();
  const bookings: SpaBooking[] = [];
  let id = 1;
  
  // Generate bookings for the current month
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
  
  // Create bookings for each day of the month
  for (let dayOffset = -7; dayOffset <= daysInMonth + 7; dayOffset++) {
    const currentDate = addDays(monthStart, dayOffset);
    
    // Generate different number of bookings for different days
    // More bookings on weekends, fewer on weekdays
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const numberOfBookings = isWeekend ? 
      Math.floor(Math.random() * 5) + 8 : // 8-12 bookings on weekends
      Math.floor(Math.random() * 4) + 3;  // 3-6 bookings on weekdays
    
    for (let i = 0; i < numberOfBookings; i++) {
      // Randomly select a service
      const randomServiceIndex = Math.floor(Math.random() * spaServices.length);
      const service = spaServices[randomServiceIndex];
      
      // Randomly select a duration
      const randomDurationIndex = Math.floor(Math.random() * service.durations.length);
      const duration = service.durations[randomDurationIndex];
      
      // Random hour between 9 AM and 6 PM
      const hours = 9 + Math.floor(Math.random() * 9);
      const minutes = Math.random() > 0.5 ? 30 : 0;
      
      const bookingDate = new Date(currentDate);
      bookingDate.setHours(hours, minutes, 0, 0);
      
      const startTime = bookingDate.toISOString();
      const endTime = addHours(new Date(startTime), duration.minutes / 60).toISOString();
      
      // Randomly select a guest
      const guestName = guestNames[Math.floor(Math.random() * guestNames.length)];
      
      // Randomly select a therapist
      const therapistName = therapistNames[Math.floor(Math.random() * therapistNames.length)];
      
      // Randomly select a room
      const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
      
      // Determine booking status based on date
      // Past bookings are marked as completed, future as booked
      const isPastBooking = bookingDate < today;
      const status = isPastBooking ? 'completed' : 'booked';
      
      bookings.push({
        id: `booking-${id}`,
        guestId: `guest-${Math.floor(Math.random() * 100) + 1}`,
        guestName,
        serviceId: service.id,
        serviceName: service.name,
        durationId: duration.id,
        durationMinutes: duration.minutes,
        startTime,
        endTime,
        status: status as 'booked' | 'completed' | 'cancelled' | 'no-show',
        therapistId: `therapist-${Math.floor(Math.random() * 10) + 1}`,
        therapistName,
        roomId,
        createdAt: addDays(new Date(startTime), -3).toISOString()
      });
      
      id++;
    }
  }
  
  // Add a few cancelled and no-show bookings
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * bookings.length);
    if (i < 5) {
      bookings[randomIndex].status = 'cancelled';
    } else {
      bookings[randomIndex].status = 'no-show';
    }
  }
  
  return bookings;
};

// Generate the demo bookings
const existingBookings = generateDemoBookings();

const SpaBookingPage = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedService, setSelectedService] = useState<SpaService | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<SpaServiceDuration | null>(null);
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('day');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'couples'>('all');
  const [isCustomBooking, setIsCustomBooking] = useState(false);
  
  const filteredBookings = existingBookings.filter(booking => 
    isSameDay(parseISO(booking.startTime), selectedDate)
  );

  const handleServiceSelect = (service: SpaService) => {
    setSelectedService(service);
    setSelectedDuration(service.durations[0]); // Default to first duration
  };

  const handleDurationSelect = (duration: SpaServiceDuration) => {
    setSelectedDuration(duration);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCustomBooking = () => {
    setIsCustomBooking(true);
    setSelectedTimeSlot(selectedDate.toISOString()); // Use selected date as default
    setSelectedService(null); // Reset service selection for custom booking
    setSelectedDuration(null); // Reset duration selection for custom booking
    setIsBookingModalOpen(true);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setIsCustomBooking(false);
    setSelectedTimeSlot(timeSlot);
    setIsBookingModalOpen(true);
  };
  
  const handleBookingSubmit = (bookingData: any) => {
    console.log('Booking submitted:', bookingData);
    toast({
      title: "Booking successful!",
      description: `${bookingData.serviceName} booked for ${bookingData.guestName} on ${format(selectedDate, 'MMMM d, yyyy')} at ${format(parseISO(bookingData.startTime), 'h:mm a')}`,
    });
    setIsBookingModalOpen(false);
    setSelectedTimeSlot(null);
    setIsCustomBooking(false);
    setSelectedService(null);
    setSelectedDuration(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Spa Booking Management</h1>
            <p className="text-muted-foreground mt-2">
              Book spa services for guests based on availability and preferences
            </p>
          </div>
          <Button onClick={handleCustomBooking} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Custom Booking
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flower2 className="mr-2 h-5 w-5" />
                  Spa Services
                </CardTitle>
                <CardDescription>
                  Select a service and duration
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <SpaServicesList 
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
          </div>

          <div className="lg:col-span-2">
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
                <SpaCalendarView 
                  bookings={existingBookings}
                  services={spaServices}
                  selectedDate={selectedDate}
                  selectedService={selectedService}
                  selectedDuration={selectedDuration}
                  calendarView={calendarView}
                  onDateChange={handleDateChange}
                  onTimeSlotSelect={handleTimeSlotSelect}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {isBookingModalOpen && (
        <SpaBookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setIsCustomBooking(false);
            setSelectedService(null);
            setSelectedDuration(null);
          }}
          service={selectedService}
          duration={selectedDuration}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          onSubmit={handleBookingSubmit}
          isCustomBooking={isCustomBooking}
          services={spaServices}
        />
      )}
    </DashboardLayout>
  );
};

export default SpaBookingPage;
