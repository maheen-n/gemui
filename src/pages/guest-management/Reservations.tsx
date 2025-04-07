
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

// Use the extended reservation type for our dummy data
interface ExtendedReservation {
  id: string;
  reservationNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  serialNumber: string;
  entityCode: string;
  roomTypeId: string;
  pax: number;
  status: 'booking' | 'checked-in' | 'checked-out' | 'cancelled';
  createdAt: string;
}

// Removed guest reservations data
const guestReservationsData: ExtendedReservation[] = [];

const Reservations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter reservations to only show arrivals (booking status)
  const getFilteredGuests = () => {
    let filtered = guestReservationsData.filter(guest => guest.status === 'booking');
    
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
      return offset > 0 ? addDays(currentDate, 1) : currentDate;
    });
  };
  
  const viewReservationDetails = (reservationId: string) => {
    navigate(`/guest-management/reservation-details/${reservationId}`);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground mt-2">
            View and manage hotel reservations
          </p>
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
                      {/* Placeholder for when reservations are added */}
                      <div className="text-center py-12 bg-muted/20 rounded-lg">
                        <HomeIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                        <h3 className="text-lg font-medium mb-1">No Reservations</h3>
                        <p className="text-muted-foreground">
                          No reservations found. Create a new reservation to get started.
                        </p>
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

