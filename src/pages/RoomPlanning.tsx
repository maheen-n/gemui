
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { format, isBefore, startOfToday, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { RoomType, Reservation } from '@/types';
import { useNavigate } from 'react-router-dom';

// Expanded room types data with more descriptive names
const roomTypesData: RoomType[] = [
  { id: '1', name: 'Heritage Mansion', description: 'Luxurious heritage-style mansion with private garden', capacity: 4, count: 3, price: 450, amenities: ['Private Garden', 'Luxury Bathtub', 'King Bed', 'Smart TV'] },
  { id: '2', name: 'Heritage Bungalow', description: 'Elegant bungalow with colonial architecture', capacity: 2, count: 5, price: 350, amenities: ['Private Terrace', 'Queen Bed', 'Mini Bar', 'Smart TV'] },
  { id: '3', name: 'Lake Front Villa', description: 'Spacious villa with panoramic lake views', capacity: 6, count: 2, price: 550, amenities: ['Lake View', 'Private Balcony', 'Kitchenette', 'Multiple Bedrooms'] },
  { id: '4', name: 'Garden Cottage', description: 'Cozy cottage surrounded by lush gardens', capacity: 2, count: 8, price: 250, amenities: ['Garden View', 'Queen Bed', 'Breakfast Nook', 'Coffee Maker'] },
  { id: '5', name: 'Executive Suite', description: 'Premium suite with executive amenities', capacity: 2, count: 4, price: 400, amenities: ['Work Desk', 'Premium Coffee', 'King Bed', 'City View'] },
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

// Generate expanded reservations data with multiple bookings per day and reservation IDs
const generateReservations = (): Reservation[] => {
  const today = startOfToday();
  let reservations: Reservation[] = [];
  let id = 1;
  
  // Reservation IDs for linking to the detail view
  const reservationIds = ['42751-2425', '20449-2425', '55672-2425'];
  let resIdIndex = 0;
  
  // For each room type, create multiple reservations
  roomTypesData.forEach(roomType => {
    // Create multiple reservations for each date range
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
        
        // Assign one of our detail-view reservation IDs to some reservations
        const useDetailViewId = id % 15 === 0 && resIdIndex < reservationIds.length;
        const reservationId = useDetailViewId ? reservationIds[resIdIndex++] : id.toString();
        
        reservations.push({
          id: reservationId,
          guestName,
          reservationNumber: `RES${(1000 + id).toString()}`,
          pax,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          roomTypeId: roomType.id,
          roomNumber,
          status: 'confirmed',
          createdAt: format(addDays(checkIn, -10), 'yyyy-MM-dd'),
          // Additional fields to support room details view
          booker: {
            name: guestName,
            email: `${guestName.toLowerCase().replace(' ', '.')}@example.com`,
            phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
            agentCode: Math.random() > 0.7 ? `A${Math.floor(Math.random() * 9000) + 1000}` : undefined,
            agentName: Math.random() > 0.7 ? 'EXPEDIA TRAVEL' : undefined
          },
          displayName: guestName,
          totalAmount: roomType.price * stayDuration,
          currency: 'USD'
        });
        
        id++;
      }
    }
  });
  
  return reservations;
};

const reservationsData = generateReservations();

const RoomPlanning = () => {
  const navigate = useNavigate();
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
  
  const handleViewReservationDetails = (reservationId: string) => {
    navigate(`/guest-management/reservation-details/${reservationId}`);
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
              onViewReservationDetails={handleViewReservationDetails}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RoomPlanning;
