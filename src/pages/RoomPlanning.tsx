
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { Reservation, RoomType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

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
    
    // Enhanced mock reservations with a mix of assigned and unassigned rooms
    const mockReservations: Reservation[] = [
      {
        id: "42751-2425",
        reservationNumber: "42751-2425",
        guestName: "MR. RAFEEQ ALI",
        checkIn: "2025-03-30",
        checkOut: "2025-03-31",
        roomTypeId: "1",
        roomNumber: "101", // Assigned room
        pax: 2,
        status: "confirmed",
        createdAt: "2025-03-20",
        totalAmount: 5206.0,
        currency: "INR",
        displayName: "MR. RAFEEQ ALI"
      },
      {
        id: "20449-2425",
        reservationNumber: "20449-2425",
        guestName: "LAMPH",
        checkIn: "2025-03-30",
        checkOut: "2025-04-03",
        roomTypeId: "2",
        // No roomNumber - unassigned
        pax: 3,
        status: "booking",
        createdAt: "2025-03-20",
        totalAmount: 20000.0,
        currency: "USD"
      },
      {
        id: "55672-2425",
        reservationNumber: "55672-2425",
        guestName: "SARAH JOHNSON",
        checkIn: "2025-03-31",
        checkOut: "2025-04-05",
        roomTypeId: "3",
        roomNumber: "301", // Assigned room
        pax: 4,
        status: "confirmed",
        createdAt: "2025-03-21",
        totalAmount: 30000.0,
        currency: "USD"
      },
      {
        id: "61234-2425",
        reservationNumber: "61234-2425",
        guestName: "ROBERT WILSON",
        checkIn: "2025-04-02",
        checkOut: "2025-04-07",
        roomTypeId: "4",
        // No roomNumber - unassigned
        pax: 2,
        status: "confirmed",
        createdAt: "2025-03-22",
        totalAmount: 12000.0,
        currency: "USD"
      },
      {
        id: "71234-2425",
        reservationNumber: "71234-2425",
        guestName: "MARIA GARCIA",
        checkIn: "2025-04-01",
        checkOut: "2025-04-04",
        roomTypeId: "1",
        roomNumber: "104", // Assigned room
        pax: 2,
        status: "confirmed",
        createdAt: "2025-03-23",
        totalAmount: 15618.0,
        currency: "INR"
      },
      {
        id: "81234-2425",
        reservationNumber: "81234-2425",
        guestName: "JAMES SMITH",
        checkIn: "2025-03-29",
        checkOut: "2025-04-01",
        roomTypeId: "2",
        roomNumber: "201", // Assigned room
        pax: 2,
        status: "confirmed",
        createdAt: "2025-03-20",
        totalAmount: 24000.0,
        currency: "USD"
      },
      // Add more reservations with a mix of assigned and unassigned rooms
      {
        id: "91234-2425",
        reservationNumber: "91234-2425",
        guestName: "EMILY JOHNSON",
        checkIn: "2025-04-03",
        checkOut: "2025-04-06",
        roomTypeId: "3",
        // No roomNumber - unassigned
        pax: 3,
        status: "booking",
        createdAt: "2025-03-24",
        totalAmount: 45000.0,
        currency: "USD"
      },
      {
        id: "10123-2425",
        reservationNumber: "10123-2425",
        guestName: "DAVID BROWN",
        checkIn: "2025-04-04",
        checkOut: "2025-04-08",
        roomTypeId: "4",
        roomNumber: "401", // Assigned room
        pax: 2,
        status: "confirmed",
        createdAt: "2025-03-25",
        totalAmount: 48000.0,
        currency: "USD"
      },
      {
        id: "11123-2425",
        reservationNumber: "11123-2425",
        guestName: "SOPHIA WILLIAMS",
        checkIn: "2025-04-02",
        checkOut: "2025-04-04",
        roomTypeId: "1",
        // No roomNumber - unassigned
        pax: 1,
        status: "booking",
        createdAt: "2025-03-26",
        totalAmount: 10412.0,
        currency: "INR"
      },
      {
        id: "12123-2425",
        reservationNumber: "12123-2425",
        guestName: "MICHAEL DAVIS",
        checkIn: "2025-04-05",
        checkOut: "2025-04-09",
        roomTypeId: "2",
        roomNumber: "202", // Assigned room
        pax: 2,
        status: "confirmed",
        createdAt: "2025-03-27",
        totalAmount: 32000.0,
        currency: "USD"
      },
      {
        id: "13123-2425",
        reservationNumber: "13123-2425",
        guestName: "OLIVIA MILLER",
        checkIn: "2025-04-06",
        checkOut: "2025-04-10",
        roomTypeId: "3",
        // No roomNumber - unassigned
        pax: 4,
        status: "booking",
        createdAt: "2025-03-28",
        totalAmount: 60000.0,
        currency: "USD"
      },
      {
        id: "14123-2425",
        reservationNumber: "14123-2425",
        guestName: "WILLIAM WILSON",
        checkIn: "2025-04-07",
        checkOut: "2025-04-12",
        roomTypeId: "4",
        roomNumber: "402", // Assigned room
        pax: 3,
        status: "confirmed",
        createdAt: "2025-03-29",
        totalAmount: 60000.0,
        currency: "USD"
      }
    ];
    
    setRoomTypes(mockRoomTypes);
    setReservations(mockReservations);
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
          <Button onClick={handleCreateReservation}>Create Reservation</Button>
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
