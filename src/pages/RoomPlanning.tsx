
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { format, isBefore, startOfToday, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { RoomType, Reservation } from '@/types';

// Expanded room types data with more descriptive names
const roomTypesData: RoomType[] = [
  { id: '1', name: 'Heritage Mansion', description: 'Luxurious heritage-style mansion with private garden', capacity: 4, count: 3 },
  { id: '2', name: 'Heritage Bungalow', description: 'Elegant bungalow with colonial architecture', capacity: 2, count: 5 },
  { id: '3', name: 'Lake Front Villa', description: 'Spacious villa with panoramic lake views', capacity: 6, count: 2 },
  { id: '4', name: 'Garden Cottage', description: 'Cozy cottage surrounded by lush gardens', capacity: 2, count: 8 },
  { id: '5', name: 'Executive Suite', description: 'Premium suite with executive amenities', capacity: 2, count: 4 },
];

// Generate more realistic guest names
const guestNames = [
  'Tarun Mehta', 'Anis Khan', 'Sophie Williams', 'Raj Patel', 'Emma Thompson',
  'David Chen', 'Priya Sharma', 'Michael Garcia', 'Leila Ahmed', 'James Wilson',
  'Ananya Singh', 'Robert Johnson', 'Lakshmi Narayanan', 'Maria Rodriguez', 'Li Wei',
  'Carlos Perez', 'Natasha Ivanovic', 'John Smith', 'Aisha Rahman', 'Pablo Escobar',
  'Elena Rodriguez', 'Mohammed Al-Fayed', 'Siti Nurhaliza', 'Hiroshi Tanaka', 'Kim Min-ji',
  'Fatima Hassan', 'Pedro Gonzalez', 'Mei Lin', 'Ravi Kumar', 'Sarah Johnson'
];

// Generate expanded reservations data with multiple bookings per day
const generateReservations = (): Reservation[] => {
  const today = startOfToday();
  let reservations: Reservation[] = [];
  let id = 1;
  
  // For each room type, create multiple reservations
  roomTypesData.forEach(roomType => {
    // Create multiple reservations for each date range
    // This will result in multiple bookings on the same day for the same room type
    for (let dayOffset = -3; dayOffset <= 10; dayOffset += 2) {
      // Number of reservations to create for this date range (2-5 bookings)
      const numberOfReservations = Math.floor(Math.random() * 4) + 2;
      
      for (let i = 0; i < numberOfReservations; i++) {
        // Create a reservation starting at this day offset
        const checkIn = addDays(today, dayOffset);
        
        // Stay duration (1 to 5 days)
        const stayDuration = Math.floor(Math.random() * 5) + 1;
        const checkOut = addDays(checkIn, stayDuration);
        
        // Random guest name
        const guestName = guestNames[Math.floor(Math.random() * guestNames.length)];
        
        // Random number of guests (1 to room capacity)
        const pax = Math.floor(Math.random() * roomType.capacity) + 1;
        
        // Assign room number to only a few reservations (20% chance)
        const hasRoomAssigned = Math.random() > 0.8;
        const roomNumber = hasRoomAssigned 
          ? `${roomType.id}${(Math.floor(Math.random() * roomType.count) + 1).toString().padStart(2, '0')}` 
          : undefined;
        
        reservations.push({
          id: id.toString(),
          guestName,
          reservationNumber: `RES${(1000 + id).toString()}`,
          pax,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          roomTypeId: roomType.id,
          roomNumber,
          status: 'confirmed',
          createdAt: format(addDays(checkIn, -10), 'yyyy-MM-dd')
        });
        
        id++;
      }
    }
  });
  
  return reservations;
};

const reservationsData = generateReservations();

const RoomPlanning = () => {
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(reservationsData);

  const filteredReservations = selectedRoomTypeId 
    ? reservations.filter(res => res.roomTypeId === selectedRoomTypeId) 
    : reservations;

  const handleAssignRoom = (reservationId: string, roomNumber: string) => {
    // Validation: Check if room is available and reservation is not in the past
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (!reservation) return;
    
    const today = startOfToday();
    if (isBefore(new Date(reservation.checkIn), today)) {
      // Can't modify past reservations
      return;
    }
    
    // Check if room is already booked for this period
    const isRoomAvailable = !reservations.some(r => 
      r.id !== reservationId && 
      r.roomNumber === roomNumber &&
      !(new Date(r.checkOut) <= new Date(reservation.checkIn) || 
        new Date(r.checkIn) >= new Date(reservation.checkOut))
    );
    
    if (!isRoomAvailable) {
      // Show error or handle double booking
      console.error('Room already booked for this period');
      return;
    }
    
    // Update reservation with assigned room
    setReservations(reservations.map(r => 
      r.id === reservationId ? { ...r, roomNumber } : r
    ));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Room Planning</h1>
          <p className="text-muted-foreground mt-2">
            Manage room assignments and view upcoming reservations
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <ReservationCalendar 
              reservations={reservations}
              roomTypes={roomTypesData}
              onAssignRoom={handleAssignRoom}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RoomPlanning;
