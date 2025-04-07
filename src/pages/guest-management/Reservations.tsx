import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format, addDays } from 'date-fns';
import { 
  Card, 
  CardContent, 
} from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  X, 
  Eye, 
  Calendar,
  HomeIcon,
  Users2,
  DollarSign,
  CalendarClock,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Reservation } from '@/types';
import { mockReservations } from '@/data/mockReservations';

const Reservations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter reservations to only show arrivals (booking status)
  const getFilteredGuests = () => {
    let filtered = mockReservations.filter(guest => guest.status === 'booking');
    
    // Apply date filter
    filtered = filtered.filter(guest => 
      format(new Date(guest.checkIn), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

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
      if (offset === 0) return new Date(); // Today
      return addDays(currentDate, offset);
    });
  };
  
  const viewReservationDetails = (reservationId: string) => {
    navigate(`/guest-management/reservation-details/${reservationId}`);
  };
  
  const navigateToRoomPlanning = () => {
    navigate('/room-planning');
  };
  
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
      case 'booking':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Booking</Badge>;
      case 'checked-in':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Checked In</Badge>;
      case 'checked-out':
        return <Badge variant="outline">Checked Out</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Cancelled</Badge>;
      case 'no-show':
        return <Badge className="bg-amber-500 text-white hover:bg-amber-600">No Show</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
            <p className="text-muted-foreground mt-2">
              View and manage hotel reservations
            </p>
          </div>
          <Button onClick={navigateToRoomPlanning}>
            View Room Planning
          </Button>
        </div>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            {/* Date Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleDateChange(0)}
                >
                  Today
                </Button>
                <Button 
                  variant={format(selectedDate, 'yyyy-MM-dd') === format(addDays(new Date(), 1), 'yyyy-MM-dd') ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleDateChange(1)}
                >
                  Tomorrow
                </Button>
                <Badge variant="outline" className="flex items-center gap-1 py-2 px-3">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(selectedDate, 'MMMM d, yyyy')}
                </Badge>
              </div>
              
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, reservation #, room type" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9 bg-muted/30 border-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Reservation List */}
            <ScrollArea className="h-[calc(100vh-320px)] min-h-[400px] pr-4">
              <div className="space-y-3">
                {getFilteredGuests().length > 0 ? (
                  getFilteredGuests().map((reservation) => (
                    <Card key={reservation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center p-4 cursor-pointer" 
                           onClick={() => viewReservationDetails(reservation.id)}>
                        <div className="flex-1 mb-3 md:mb-0">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{reservation.guestName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {reservation.reservationNumber} • {reservation.displayName}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                              {getStatusBadge(reservation.status)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 text-sm">
                          <div className="flex items-center">
                            <Users2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{reservation.pax} guests</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{format(new Date(reservation.checkIn), 'MMM d')} - {format(new Date(reservation.checkOut), 'MMM d')}</span>
                          </div>
                          <div className="flex items-center col-span-2 md:col-span-1">
                            <HomeIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{reservation.displayName.split(' - ')[0]}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: reservation.currency || 'USD' }).format(reservation.totalAmount || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <HomeIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Reservations Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search query" 
                        : `No reservations for ${format(selectedDate, 'MMMM d, yyyy')}`}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reservations;
