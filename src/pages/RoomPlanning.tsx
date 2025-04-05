
import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { Reservation, RoomType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const RoomPlanning = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    // Simulated data loading
    const mockRoomTypes: RoomType[] = [
      {
        id: 'rt1',
        name: 'Standard Room',
        description: 'Comfortable room with basic amenities',
        price: 100,
        capacity: 2,
        amenities: ['Wi-Fi', 'TV', 'Air conditioning'],
        count: 10
      },
      {
        id: 'rt2',
        name: 'Deluxe Room',
        description: 'Spacious room with premium amenities',
        price: 200,
        capacity: 2,
        amenities: ['Wi-Fi', 'TV', 'Mini bar', 'Air conditioning'],
        count: 8
      },
      {
        id: 'rt3',
        name: 'Suite',
        description: 'Luxury suite with separate living area',
        price: 350,
        capacity: 4,
        amenities: ['Wi-Fi', 'TV', 'Mini bar', 'Air conditioning', 'Separate living room'],
        count: 5
      }
    ];
    
    // Generate mock reservations
    const generateReservations = () => {
      const mockReservations: Reservation[] = [];
      const guestNames = [
        'John Smith', 'Jane Doe', 'Robert Johnson', 'Emily Davis', 
        'Michael Brown', 'Sarah Wilson', 'David Miller', 'Lisa Garcia'
      ];
      
      for (let i = 0; i < 15; i++) {
        const roomType = mockRoomTypes[Math.floor(Math.random() * mockRoomTypes.length)];
        const randomDaysOffset = Math.floor(Math.random() * 10) - 2; // -2 to 7 days from now
        const checkIn = addDays(new Date(), randomDaysOffset);
        const stayDuration = Math.floor(Math.random() * 5) + 1; // 1 to 5 days
        const checkOut = addDays(checkIn, stayDuration);
        const guestName = guestNames[Math.floor(Math.random() * guestNames.length)];
        const pax = Math.floor(Math.random() * 3) + 1; // 1 to 3 people
        const roomNumber = Math.random() > 0.5 ? `${100 + Math.floor(Math.random() * 20)}` : undefined;
        const reservationId = `res-${i + 1}`;
        
        const reservation: Reservation = {
          id: reservationId,
          guestName,
          reservationNumber: `RES${(1000 + i).toString()}`,
          pax,
          checkIn: format(checkIn, 'yyyy-MM-dd'),
          checkOut: format(checkOut, 'yyyy-MM-dd'),
          roomTypeId: roomType.id,
          roomNumber,
          status: 'confirmed',
          createdAt: format(addDays(checkIn, -10), 'yyyy-MM-dd'),
          totalAmount: roomType.price ? roomType.price * stayDuration : undefined,
          currency: 'USD',
          displayName: guestName
        };
        
        mockReservations.push(reservation);
      }
      
      return mockReservations;
    };
    
    setRoomTypes(mockRoomTypes);
    setReservations(generateReservations());
  }, []);

  const handleAssignRoom = (reservationId: string, roomNumber: string) => {
    setReservations(prevReservations => 
      prevReservations.map(res => 
        res.id === reservationId 
          ? { ...res, roomNumber } 
          : res
      )
    );
    
    toast({
      title: "Room Assigned",
      description: `Room ${roomNumber} has been assigned to the reservation.`,
    });
  };

  const handleViewReservationDetails = (reservationId: string) => {
    // Navigate to reservation details in a real app
    toast({
      title: "View Reservation",
      description: `Viewing details for reservation ${reservationId}`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Room Planning</h1>
          <Button>Create Reservation</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Accommodation Calendar</CardTitle>
            <CardDescription>
              View and manage room assignments for all reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReservationCalendar 
              reservations={reservations} 
              roomTypes={roomTypes}
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
