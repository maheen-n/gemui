
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { Reservation, RoomType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Import the same dummy data as in Reservations
const dummyReservations: Reservation[] = [
  {
    id: '1',
    guestName: 'John Smith',
    reservationNumber: 'RES10001',
    pax: 2,
    checkIn: '2025-04-10T14:00:00',
    checkOut: '2025-04-13T12:00:00',
    roomTypeId: '1',
    status: 'booking',
    createdAt: '2025-03-15T09:23:00',
    totalAmount: 15618,
    currency: 'USD',
    displayName: 'Executive Room - 3 nights'
  },
  {
    id: '2',
    guestName: 'Maria Garcia',
    reservationNumber: 'RES10002',
    pax: 3,
    checkIn: '2025-04-10T14:00:00',
    checkOut: '2025-04-15T12:00:00',
    roomTypeId: '3',
    status: 'booking',
    createdAt: '2025-03-20T14:30:00',
    totalAmount: 75000,
    currency: 'USD',
    displayName: 'Family Suite - 5 nights'
  },
  {
    id: '3',
    guestName: 'Robert Johnson',
    reservationNumber: 'RES10003',
    pax: 1,
    checkIn: '2025-04-11T14:00:00',
    checkOut: '2025-04-14T12:00:00',
    roomTypeId: '2',
    status: 'booking',
    createdAt: '2025-03-22T11:15:00',
    totalAmount: 24000,
    currency: 'USD',
    displayName: 'Deluxe Room - 3 nights'
  },
  {
    id: '4',
    guestName: 'Sarah Williams',
    reservationNumber: 'RES10004',
    pax: 2,
    checkIn: '2025-04-12T14:00:00',
    checkOut: '2025-04-14T12:00:00',
    roomTypeId: '4',
    status: 'booking',
    createdAt: '2025-03-25T16:45:00',
    totalAmount: 24000,
    currency: 'USD',
    displayName: 'Suite - 2 nights'
  },
  {
    id: '5',
    guestName: 'Michael Brown',
    reservationNumber: 'RES10005',
    pax: 4,
    checkIn: '2025-04-11T14:00:00',
    checkOut: '2025-04-18T12:00:00',
    roomTypeId: '3',
    status: 'booking',
    createdAt: '2025-03-28T10:20:00',
    totalAmount: 105000,
    currency: 'USD',
    displayName: 'Family Suite - 7 nights'
  }
];

const RoomPlanning = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    // Room types data
    const mockRoomTypes: RoomType[] = [
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
    
    setRoomTypes(mockRoomTypes);
    // Set the dummy reservations
    setReservations(dummyReservations);
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
    navigate(`/guest-management/reservation-details/${reservationId}`);
    
    toast({
      title: "View Reservation",
      description: `Viewing details for reservation ${reservationId}`,
    });
  };

  const handleCreateReservation = () => {
    navigate('/guest-management/reservations');
    
    toast({
      title: "Create Reservation",
      description: "Navigating to reservations page to create a new booking.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Room Planning</h1>
          <Button onClick={handleCreateReservation}>View Reservations</Button>
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
