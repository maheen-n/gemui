
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format, addDays, subDays } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
} from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plane, 
  Search, 
  X, 
  Eye, 
  Calendar,
  HomeIcon,
  Users2,
  DollarSign,
  Badge as BadgeIcon,
  CalendarClock,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
  booker?: {
    name: string;
    gender?: string | null;
    email?: string | null;
    phone?: string | null;
    agentCode?: string;
    agentName?: string;
  };
  rooms?: {
    subReservationId: string;
    serialNumber: string;
    type: string;
    title: string;
    firstName: string;
    lastName: string;
    lengthOfStay: number;
    totalAmount: number;
    status: string;
    mainGuest: boolean;
    adultCount: number;
    childCount: number;
    mealPlan: string;
    checkInTime: number;
    checkOutTime: number;
  }[];
  totalAmount?: number;
  currency?: string;
  displayName?: string;
}

// Enhanced dummy data with multiple rooms per reservation
const guestReservationsData: ExtendedReservation[] = [
  {
    id: "42751-2425",
    reservationNumber: "42751-2425",
    guestName: "MR. RAFEEQ ALI",
    checkIn: "2025-03-30",
    checkOut: "2025-03-31",
    serialNumber: "01",
    entityCode: "CH",
    roomTypeId: "1",
    pax: 2,
    status: "booking", // Status is booking - should appear in arrivals
    createdAt: "2025-03-20",
    booker: {
      name: "RAFEEQ ALI",
      agentCode: "A2439",
      agentName: "EXPEDIA TRAVEL"
    },
    rooms: [
      {
        subReservationId: "42751-2425-1",
        serialNumber: "01",
        type: "Executive Room",
        title: "MR.",
        firstName: "RAFEEQ",
        lastName: "ALI",
        lengthOfStay: 1,
        totalAmount: 0.0,
        status: "booking",
        mainGuest: true,
        adultCount: 2,
        childCount: 2,
        mealPlan: "CP",
        checkInTime: 1743582600000,
        checkOutTime: 1743658200000
      }
    ],
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
    serialNumber: "02",
    entityCode: "MB",
    roomTypeId: "2",
    pax: 3,
    status: "booking", // Status is booking - should appear in arrivals
    createdAt: "2025-03-20",
    rooms: [
      {
        subReservationId: "20449-2425-1",
        serialNumber: "01",
        type: "Suite",
        title: "MS.",
        firstName: "LAMPH",
        lastName: "",
        lengthOfStay: 4,
        totalAmount: 12000.0,
        status: "booking",
        mainGuest: true,
        adultCount: 1,
        childCount: 0,
        mealPlan: "AP",
        checkInTime: 1743582600000,
        checkOutTime: 1743917400000
      },
      {
        subReservationId: "20449-2425-2",
        serialNumber: "02",
        type: "Deluxe Room",
        title: "MR.",
        firstName: "JOHN",
        lastName: "DOE",
        lengthOfStay: 4,
        totalAmount: 8000.0,
        status: "booking",
        mainGuest: false,
        adultCount: 2,
        childCount: 0,
        mealPlan: "CP",
        checkInTime: 1743582600000,
        checkOutTime: 1743917400000
      }
    ],
    totalAmount: 20000.0,
    currency: "USD"
  },
  {
    id: "55672-2425",
    reservationNumber: "55672-2425",
    guestName: "SARAH JOHNSON",
    checkIn: "2025-03-31",
    checkOut: "2025-04-05",
    serialNumber: "03",
    entityCode: "CH",
    roomTypeId: "3",
    pax: 4,
    status: "booking", // Status is booking - should appear in arrivals
    createdAt: "2025-03-21",
    rooms: [
      {
        subReservationId: "55672-2425-1",
        serialNumber: "01",
        type: "Family Suite",
        title: "MRS.",
        firstName: "SARAH",
        lastName: "JOHNSON",
        lengthOfStay: 5,
        totalAmount: 15000.0,
        status: "booking",
        mainGuest: true,
        adultCount: 2,
        childCount: 2,
        mealPlan: "MAP",
        checkInTime: 1743669000000,
        checkOutTime: 1744100600000
      },
      {
        subReservationId: "55672-2425-2",
        serialNumber: "02",
        type: "Family Suite",
        title: "MR.",
        firstName: "MICHAEL",
        lastName: "JOHNSON",
        lengthOfStay: 5,
        totalAmount: 15000.0,
        status: "booking",
        mainGuest: false,
        adultCount: 2,
        childCount: 0,
        mealPlan: "MAP",
        checkInTime: 1743669000000,
        checkOutTime: 1744100600000
      }
    ],
    totalAmount: 30000.0,
    currency: "USD"
  }
];

const Reservations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date('2025-03-30')); // Set to match our sample data

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
        guest.reservationNumber.includes(searchQuery) ||
        guest.rooms?.some(room => 
          room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (room.firstName + " " + room.lastName).toLowerCase().includes(searchQuery.toLowerCase())
        )
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
          <h1 className="text-3xl font-bold tracking-tight">Arrivals</h1>
          <p className="text-muted-foreground mt-2">
            View and manage upcoming guest arrivals
          </p>
        </div>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            {/* Header with Plane icon */}
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-100 p-2 rounded-full">
                <Plane className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold">Today's Arrivals</h2>
            </div>

            {/* Date Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
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
                      <div className="flex flex-col sm:flex-row">
                        {/* Status Indicator */}
                        <div className="w-full sm:w-1.5 h-1.5 sm:h-auto bg-blue-500"></div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">{reservation.id}</Badge>
                                {getStatusBadge(reservation.status)}
                                {reservation.booker?.agentName && (
                                  <Badge variant="secondary">
                                    {reservation.booker.agentName}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-lg">{reservation.guestName}</h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <CalendarClock className="h-3.5 w-3.5" />
                                  <span>{format(new Date(reservation.checkIn), 'MMM d')} - {format(new Date(reservation.checkOut), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <HomeIcon className="h-3.5 w-3.5" />
                                  <span>
                                    {reservation.rooms?.length} {reservation.rooms?.length === 1 ? 'Room' : 'Rooms'}
                                    {reservation.rooms?.[0] && ` (${reservation.rooms[0].type}${reservation.rooms.length > 1 ? ', ...' : ''})`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users2 className="h-3.5 w-3.5" />
                                  <span>
                                    {reservation.rooms?.reduce((acc, room) => acc + room.adultCount, 0) || 0} Adults, 
                                    {reservation.rooms?.reduce((acc, room) => acc + room.childCount, 0) || 0} Children
                                  </span>
                                </div>
                                {reservation.totalAmount && (
                                  <div className="flex items-center gap-1 font-medium">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    <span>{reservation.totalAmount.toLocaleString()} {reservation.currency}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1.5"
                                onClick={() => viewReservationDetails(reservation.id)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <Plane className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Arrivals Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search query" 
                        : `No arrivals for ${format(selectedDate, 'MMMM d, yyyy')}`}
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
