
import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { format, isBefore, startOfToday, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoomTypeList from '@/components/room-planning/RoomTypeList';
import ReservationCalendar from '@/components/room-planning/ReservationCalendar';
import { RoomType, Reservation } from '@/types';

// Expanded room types data
const roomTypesData: RoomType[] = [
  { id: '1', name: 'Standard', description: 'Standard room with basic amenities', capacity: 2, count: 10 },
  { id: '2', name: 'Deluxe', description: 'Deluxe room with premium amenities', capacity: 2, count: 8 },
  { id: '3', name: 'Suite', description: 'Spacious suite with separate living area', capacity: 4, count: 5 },
  { id: '4', name: 'Family', description: 'Large room suitable for families', capacity: 6, count: 3 },
  { id: '5', name: 'Executive', description: 'Premium room with executive benefits', capacity: 2, count: 4 },
];

// Expanded reservations data with more realistic scenarios
const reservationsData: Reservation[] = [
  // Standard Room Reservations
  {
    id: '1',
    guestName: 'John Smith',
    reservationNumber: 'RES001',
    pax: 2,
    checkIn: format(addDays(new Date(), -2), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    roomTypeId: '1',
    roomNumber: '101',
    status: 'confirmed',
    createdAt: '2024-05-10'
  },
  {
    id: '2',
    guestName: 'Sarah Johnson',
    reservationNumber: 'RES002',
    pax: 2,
    checkIn: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 6), 'yyyy-MM-dd'),
    roomTypeId: '1',
    roomNumber: '102',
    status: 'confirmed',
    createdAt: '2024-05-12'
  },
  {
    id: '3',
    guestName: 'Robert Brown',
    reservationNumber: 'RES003',
    pax: 1,
    checkIn: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
    roomTypeId: '1',
    status: 'confirmed',
    createdAt: '2024-05-15'
  },
  // Deluxe Room Reservations
  {
    id: '4',
    guestName: 'Emily Davis',
    reservationNumber: 'RES004',
    pax: 2,
    checkIn: format(addDays(new Date(), -4), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    roomTypeId: '2',
    roomNumber: '201',
    status: 'confirmed',
    createdAt: '2024-05-18'
  },
  {
    id: '5',
    guestName: 'Michael Wilson',
    reservationNumber: 'RES005',
    pax: 2,
    checkIn: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 9), 'yyyy-MM-dd'),
    roomTypeId: '2',
    roomNumber: '202',
    status: 'confirmed',
    createdAt: '2024-05-20'
  },
  // Suite Reservations
  {
    id: '6',
    guestName: 'Jennifer Taylor',
    reservationNumber: 'RES006',
    pax: 3,
    checkIn: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    roomTypeId: '3',
    roomNumber: '301',
    status: 'confirmed',
    createdAt: '2024-05-22'
  },
  {
    id: '7',
    guestName: 'David Anderson',
    reservationNumber: 'RES007',
    pax: 4,
    checkIn: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 12), 'yyyy-MM-dd'),
    roomTypeId: '3',
    status: 'confirmed',
    createdAt: '2024-06-01'
  },
  // Family Room Reservations
  {
    id: '8',
    guestName: 'Thomas Miller',
    reservationNumber: 'RES008',
    pax: 5,
    checkIn: format(addDays(new Date(), 4), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 11), 'yyyy-MM-dd'),
    roomTypeId: '4',
    roomNumber: '401',
    status: 'confirmed',
    createdAt: '2024-06-05'
  },
  // Executive Room Reservations
  {
    id: '9',
    guestName: 'Patricia Clark',
    reservationNumber: 'RES009',
    pax: 2,
    checkIn: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    roomTypeId: '5',
    roomNumber: '501',
    status: 'confirmed',
    createdAt: '2024-06-08'
  },
  {
    id: '10',
    guestName: 'Elizabeth Martin',
    reservationNumber: 'RES010',
    pax: 1,
    checkIn: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    roomTypeId: '5',
    status: 'confirmed',
    createdAt: '2024-06-10'
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
            <Card>
              <CardHeader>
                <CardTitle>Room Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 shrink-0">
                      <h3 className="text-lg font-medium mb-3">Room Types</h3>
                      <RoomTypeList 
                        roomTypes={roomTypesData} 
                        selectedRoomTypeId={selectedRoomTypeId}
                        onSelectRoomType={handleSelectRoomType}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium mb-3">
                        Reservation Calendar
                        {selectedRoomTypeId && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({roomTypesData.find(rt => rt.id === selectedRoomTypeId)?.name})
                          </span>
                        )}
                      </h3>
                      <ReservationCalendar 
                        reservations={filteredReservations}
                        roomTypes={roomTypesData}
                        onAssignRoom={handleAssignRoom}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
