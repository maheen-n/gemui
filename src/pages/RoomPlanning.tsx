
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { Reservation, RoomType } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { mockReservations, mockRoomTypes } from '@/data/mockReservations';

const RoomPlanning = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    // Set the mock data from our shared utility file
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
