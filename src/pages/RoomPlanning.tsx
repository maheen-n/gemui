import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInDays } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Reservation, RoomType } from '@/types';
import { mockReservations } from '@/data/mockReservationsData';

// Define room types
const roomTypes: RoomType[] = [
  {
    id: '1',
    name: 'Executive Room',
    description: 'Comfortable modern room with executive amenities',
    price: 5206,
    capacity: 2,
    amenities: ['Wi-Fi', 'Smart TV', 'Mini bar', 'Coffee Machine', 'Air conditioning'],
    count: 10
  },
  {
    id: '2',
    name: 'Deluxe Room',
    description: 'Spacious room with premium amenities',
    price: 8000,
    capacity: 2,
    amenities: ['Wi-Fi', 'Smart TV', 'Mini bar', 'Air conditioning', 'Balcony'],
    count: 8
  },
  {
    id: '3',
    name: 'Family Suite',
    description: 'Luxury suite with separate living area for families',
    price: 15000,
    capacity: 4,
    amenities: ['Wi-Fi', 'Smart TV', 'Mini bar', 'Air conditioning', 'Separate living room', 'Kitchenette'],
    count: 5
  },
  {
    id: '4',
    name: 'Suite',
    description: 'Luxury suite with premium amenities',
    price: 12000,
    capacity: 3,
    amenities: ['Wi-Fi', 'Smart TV', 'Mini bar', 'Air conditioning', 'Separate living room', 'Jacuzzi'],
    count: 6
  }
];

const RoomPlanning = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations);

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
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      toast({
        title: "Reservation Details",
        description: `
          Guest: ${reservation.guestName}
          Room: ${reservation.roomNumber || 'Not assigned'}
          Check-in: ${format(new Date(reservation.checkIn), 'dd MMM yyyy')}
          Check-out: ${format(new Date(reservation.checkOut), 'dd MMM yyyy')}
          Pax: ${reservation.pax}
          Amount: ${reservation.currency} ${reservation.totalAmount}
        `,
      });
    }
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
