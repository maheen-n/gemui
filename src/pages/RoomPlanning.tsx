
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { format, isBefore, startOfToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoomTypeList from '@/components/room-planning/RoomTypeList';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { RoomType, Reservation } from '@/types';

// Sample room types data
const roomTypesData: RoomType[] = [
  { id: '1', name: 'Standard', description: 'Standard room with basic amenities', capacity: 2, count: 10 },
  { id: '2', name: 'Deluxe', description: 'Deluxe room with premium amenities', capacity: 2, count: 8 },
  { id: '3', name: 'Suite', description: 'Spacious suite with separate living area', capacity: 4, count: 5 },
  { id: '4', name: 'Family', description: 'Large room suitable for families', capacity: 6, count: 3 },
  { id: '5', name: 'Executive', description: 'Premium room with executive benefits', capacity: 2, count: 4 },
];

// Sample reservations data
const reservationsData: Reservation[] = [
  {
    id: '1',
    guestName: 'John Smith',
    reservationNumber: 'RES001',
    pax: 2,
    checkIn: '2024-06-15',
    checkOut: '2024-06-18',
    roomTypeId: '1',
    roomNumber: '101',
    status: 'confirmed',
    createdAt: '2024-05-10'
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    reservationNumber: 'RES002',
    pax: 3,
    checkIn: '2024-06-20',
    checkOut: '2024-06-25',
    roomTypeId: '2',
    roomNumber: '205',
    status: 'confirmed',
    createdAt: '2024-05-12'
  },
  {
    id: '3',
    guestName: 'Michael Brown',
    reservationNumber: 'RES003',
    pax: 4,
    checkIn: '2024-06-18',
    checkOut: '2024-06-22',
    roomTypeId: '3',
    status: 'confirmed',
    createdAt: '2024-05-15'
  },
  {
    id: '4',
    guestName: 'Emily Davis',
    reservationNumber: 'RES004',
    pax: 2,
    checkIn: '2024-06-25',
    checkOut: '2024-06-28',
    roomTypeId: '1',
    status: 'confirmed',
    createdAt: '2024-05-18'
  },
  {
    id: '5',
    guestName: 'Daniel Wilson',
    reservationNumber: 'RES005',
    pax: 6,
    checkIn: '2024-06-17',
    checkOut: '2024-06-24',
    roomTypeId: '4',
    status: 'confirmed',
    createdAt: '2024-05-20'
  },
  {
    id: '6',
    guestName: 'Jennifer Taylor',
    reservationNumber: 'RES006',
    pax: 2,
    checkIn: '2024-06-22',
    checkOut: '2024-06-26',
    roomTypeId: '5',
    status: 'confirmed',
    createdAt: '2024-05-22'
  },
];

const RoomPlanning = () => {
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(reservationsData);
  const [activeTab, setActiveTab] = useState('calendar');

  const filteredReservations = selectedRoomTypeId 
    ? reservations.filter(res => res.roomTypeId === selectedRoomTypeId) 
    : reservations;

  const handleSelectRoomType = (roomTypeId: string) => {
    setSelectedRoomTypeId(prevId => prevId === roomTypeId ? null : roomTypeId);
  };

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

        <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RoomTypeList 
                      roomTypes={roomTypesData} 
                      selectedRoomTypeId={selectedRoomTypeId}
                      onSelectRoomType={handleSelectRoomType}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Reservation Calendar
                      {selectedRoomTypeId && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({roomTypesData.find(rt => rt.id === selectedRoomTypeId)?.name})
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReservationCalendar 
                      reservations={filteredReservations}
                      roomTypes={roomTypesData}
                      onAssignRoom={handleAssignRoom}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservation List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium py-3 px-4">Guest</th>
                        <th className="text-left font-medium py-3 px-4">Reservation</th>
                        <th className="text-left font-medium py-3 px-4">Room Type</th>
                        <th className="text-left font-medium py-3 px-4">Room</th>
                        <th className="text-left font-medium py-3 px-4">Check In</th>
                        <th className="text-left font-medium py-3 px-4">Check Out</th>
                        <th className="text-left font-medium py-3 px-4">Pax</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map(reservation => {
                        const roomType = roomTypesData.find(rt => rt.id === reservation.roomTypeId);
                        return (
                          <tr key={reservation.id} className="border-b hover:bg-accent/5">
                            <td className="py-3 px-4">{reservation.guestName}</td>
                            <td className="py-3 px-4">{reservation.reservationNumber}</td>
                            <td className="py-3 px-4">{roomType?.name}</td>
                            <td className="py-3 px-4">{reservation.roomNumber || 'Unassigned'}</td>
                            <td className="py-3 px-4">{format(new Date(reservation.checkIn), 'MMM dd, yyyy')}</td>
                            <td className="py-3 px-4">{format(new Date(reservation.checkOut), 'MMM dd, yyyy')}</td>
                            <td className="py-3 px-4">{reservation.pax}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RoomPlanning;
