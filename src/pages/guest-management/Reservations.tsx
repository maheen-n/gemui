import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { format, addDays, subDays } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plane, BedDouble, LogOut, Users, Search, X, Eye, Edit, MessageSquare } from 'lucide-react';
import { Reservation } from '@/types';

interface GuestReservation extends Reservation {
  serialNumber: string;
  entityCode: string;
}

const guestReservationsData: GuestReservation[] = [
  {
    id: "39433-2425",
    reservationNumber: "39433-2425-1",
    guestName: "Deeplakshmi Avadhoot Joshi",
    checkIn: "2025-03-30",
    checkOut: "2025-07-31",
    serialNumber: "01",
    entityCode: "CH",
    roomTypeId: "1",
    pax: 2,
    status: "confirmed",
    createdAt: "2025-03-20"
  },
  {
    id: "42692-2425",
    reservationNumber: "42692-2425-1",
    guestName: "NITISH GUPTA",
    checkIn: "2025-03-30",
    checkOut: "2025-03-31",
    serialNumber: "01",
    entityCode: "CH",
    roomTypeId: "1",
    pax: 1,
    status: "confirmed",
    createdAt: "2025-03-20"
  },
  {
    id: "20449-2425",
    reservationNumber: "20449-2425-1",
    guestName: "LAMPH",
    checkIn: "2025-03-30",
    checkOut: "2025-04-03",
    serialNumber: "02",
    entityCode: "MB",
    roomTypeId: "2",
    pax: 1,
    status: "confirmed",
    createdAt: "2025-03-20"
  },
  {
    id: "38328-2425",
    reservationNumber: "38328-2425-1",
    guestName: "HANNAH HORSHAM",
    checkIn: "2025-03-30",
    checkOut: "2025-04-04",
    serialNumber: "01",
    entityCode: "MB",
    roomTypeId: "3",
    pax: 2,
    status: "confirmed",
    createdAt: "2025-03-20"
  },
  {
    id: "40899-2425",
    reservationNumber: "40899-2425-1",
    guestName: "KEVIN KADAKIA",
    checkIn: "2025-03-30",
    checkOut: "2025-04-01",
    serialNumber: "01",
    entityCode: "MB",
    roomTypeId: "4",
    pax: 1,
    status: "confirmed",
    createdAt: "2025-03-20"
  }
];

const Reservations = () => {
  const [viewType, setViewType] = useState('arrival');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date('2025-03-30')); // Set to match our sample data

  const getFilteredGuests = () => {
    let filtered = guestReservationsData;

    // Filter based on view type
    switch (viewType) {
      case 'arrival':
        filtered = filtered.filter(guest => 
          format(new Date(guest.checkIn), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        );
        break;
      case 'inhouse':
        filtered = filtered.filter(guest => {
          const checkIn = new Date(guest.checkIn);
          const checkOut = new Date(guest.checkOut);
          return checkIn <= selectedDate && checkOut > selectedDate;
        });
        break;
      case 'dueout':
        filtered = filtered.filter(guest => 
          format(new Date(guest.checkOut), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        );
        break;
      // 'all' case doesn't need filtering
    }

    // Apply search filter if query exists
    if (searchQuery) {
      filtered = filtered.filter(guest =>
        guest.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.reservationNumber.includes(searchQuery)
      );
    }

    return filtered;
  };

  const handleDateChange = (offset: number) => {
    setSelectedDate(currentDate => {
      if (offset === 0) return new Date('2025-03-30'); // Today
      return offset > 0 ? addDays(currentDate, 1) : subDays(currentDate, 1);
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground mt-2">
            View and manage guest reservations
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* View Type Tabs */}
            <div className="flex gap-2 mb-6">
              <Button 
                variant={viewType === 'arrival' ? 'default' : 'outline'} 
                className="flex items-center gap-2 px-6"
                onClick={() => setViewType('arrival')}
              >
                <Plane className="h-4 w-4" /> Arrival
              </Button>
              <Button 
                variant={viewType === 'inhouse' ? 'default' : 'outline'} 
                className="flex items-center gap-2 px-6"
                onClick={() => setViewType('inhouse')}
              >
                <BedDouble className="h-4 w-4" /> In House
              </Button>
              <Button 
                variant={viewType === 'dueout' ? 'default' : 'outline'} 
                className="flex items-center gap-2 px-6"
                onClick={() => setViewType('dueout')}
              >
                <LogOut className="h-4 w-4" /> Due out
              </Button>
              <Button 
                variant={viewType === 'all' ? 'default' : 'outline'} 
                className="flex items-center gap-2 px-6"
                onClick={() => setViewType('all')}
              >
                <Users className="h-4 w-4" /> All
              </Button>
            </div>

            {/* Search and Date Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Button 
                  variant={format(selectedDate, 'yyyy-MM-dd') === format(subDays(new Date('2025-03-30'), 1), 'yyyy-MM-dd') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleDateChange(-1)}
                >
                  Yesterday
                </Button>
                <Button 
                  variant={format(selectedDate, 'yyyy-MM-dd') === '2025-03-30' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleDateChange(0)}
                >
                  Today
                </Button>
                <Button 
                  variant={format(selectedDate, 'yyyy-MM-dd') === format(addDays(new Date('2025-03-30'), 1), 'yyyy-MM-dd') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleDateChange(1)}
                >
                  Tomorrow
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Type here to search" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            {/* Guest List */}
            <div className="space-y-4">
              {getFilteredGuests().map((guest) => (
                <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">#{guest.reservationNumber}</div>
                    <div className="font-medium">{guest.guestName}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-sm">
                      Check in: <span className="font-medium">{format(new Date(guest.checkIn), 'dd MMM, yyyy')}</span>
                    </div>
                    <div className="text-sm">
                      Check out: <span className="font-medium">{format(new Date(guest.checkOut), 'dd MMM, yyyy')}</span>
                    </div>
                    <div className="text-sm">
                      Serial Number: <span className="font-medium">{guest.serialNumber}</span>
                    </div>
                    <div className="text-sm">
                      Entity Code: <span className="font-medium">{guest.entityCode}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reservations; 