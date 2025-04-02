
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plane, 
  BedDouble, 
  LogOut, 
  Users, 
  Search, 
  X, 
  Eye, 
  Calendar,
  ArrowRight,
  UserCircle,
  Phone,
  Mail,
  DollarSign,
  Clock,
  CalendarClock,
  HomeIcon,
  Users2,
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Reservation } from '@/types';

interface ExtendedReservation extends Reservation {
  serialNumber: string;
  entityCode: string;
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
  sourceCode?: string;
}

const guestReservationsData: ExtendedReservation[] = [
  {
    id: "42751-2425",
    reservationNumber: "42751-2425-1",
    guestName: "MR. RAFEEQ ALI",
    checkIn: "2025-03-30",
    checkOut: "2025-03-31",
    serialNumber: "01",
    entityCode: "CH",
    roomTypeId: "1",
    pax: 2,
    status: "confirmed",
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
        mainGuest: false,
        adultCount: 2,
        childCount: 2,
        mealPlan: "CP",
        checkInTime: 1743582600000,
        checkOutTime: 1743658200000
      }
    ],
    totalAmount: 5206.0,
    currency: "INR",
    displayName: "MR. RAFEEQ ALI",
    sourceCode: "20   "
  },
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
    createdAt: "2025-03-20",
    rooms: [
      {
        subReservationId: "39433-2425-1",
        serialNumber: "01",
        type: "Deluxe Room",
        title: "MRS.",
        firstName: "Deeplakshmi",
        lastName: "Joshi",
        lengthOfStay: 123,
        totalAmount: 2500.0,
        status: "booking",
        mainGuest: true,
        adultCount: 2,
        childCount: 0,
        mealPlan: "MAP",
        checkInTime: 1743582600000,
        checkOutTime: 1754458200000
      }
    ],
    totalAmount: 250000.0,
    currency: "INR"
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
    createdAt: "2025-03-20",
    rooms: [
      {
        subReservationId: "42692-2425-1",
        serialNumber: "01",
        type: "Standard Room",
        title: "MR.",
        firstName: "NITISH",
        lastName: "GUPTA",
        lengthOfStay: 1,
        totalAmount: 3500.0,
        status: "booking",
        mainGuest: true,
        adultCount: 1,
        childCount: 0,
        mealPlan: "EP",
        checkInTime: 1743582600000,
        checkOutTime: 1743658200000
      }
    ],
    totalAmount: 3500.0,
    currency: "INR"
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
      }
    ],
    totalAmount: 12000.0,
    currency: "USD"
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
    createdAt: "2025-03-20",
    rooms: [
      {
        subReservationId: "38328-2425-1",
        serialNumber: "01",
        type: "Luxury Room",
        title: "MS.",
        firstName: "HANNAH",
        lastName: "HORSHAM",
        lengthOfStay: 5,
        totalAmount: 15000.0,
        status: "booking",
        mainGuest: true,
        adultCount: 2,
        childCount: 0,
        mealPlan: "MAP",
        checkInTime: 1743582600000,
        checkOutTime: 1744003800000
      }
    ],
    totalAmount: 15000.0,
    currency: "EUR"
  }
];

const Reservations = () => {
  const [viewType, setViewType] = useState('arrival');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date('2025-03-30')); // Set to match our sample data
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ExtendedReservation | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

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
  
  const viewReservationDetails = (reservation: ExtendedReservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };
  
  const getMealPlanFull = (code: string) => {
    switch(code) {
      case 'CP': return 'Continental Plan (Breakfast only)';
      case 'MAP': return 'Modified American Plan (Breakfast & Dinner)';
      case 'AP': return 'American Plan (All Meals)';
      case 'EP': return 'European Plan (No Meals)';
      default: return code;
    }
  };
  
  const formatTimestamp = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd, yyyy hh:mm a');
  };
  
  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
      case 'booking':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Confirmed</Badge>;
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
            View and manage guest reservations
          </p>
        </div>

        <Card className="border-none shadow-md">
          <CardContent className="p-6">
            {/* View Type Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-muted/30 p-1 rounded-lg">
              <Button 
                variant={viewType === 'arrival' ? 'default' : 'ghost'} 
                className={cn("flex items-center gap-2 px-6", 
                  viewType === 'arrival' ? "shadow-sm" : "")}
                onClick={() => setViewType('arrival')}
              >
                <Plane className="h-4 w-4" /> Arrival
              </Button>
              <Button 
                variant={viewType === 'inhouse' ? 'default' : 'ghost'} 
                className={cn("flex items-center gap-2 px-6",
                  viewType === 'inhouse' ? "shadow-sm" : "")}
                onClick={() => setViewType('inhouse')}
              >
                <BedDouble className="h-4 w-4" /> In House
              </Button>
              <Button 
                variant={viewType === 'dueout' ? 'default' : 'ghost'} 
                className={cn("flex items-center gap-2 px-6",
                  viewType === 'dueout' ? "shadow-sm" : "")}
                onClick={() => setViewType('dueout')}
              >
                <LogOut className="h-4 w-4" /> Due out
              </Button>
              <Button 
                variant={viewType === 'all' ? 'default' : 'ghost'} 
                className={cn("flex items-center gap-2 px-6",
                  viewType === 'all' ? "shadow-sm" : "")}
                onClick={() => setViewType('all')}
              >
                <Users className="h-4 w-4" /> All
              </Button>
            </div>

            {/* Search and Date Filter */}
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
                        <div className={cn(
                          "w-full sm:w-1.5 h-1.5 sm:h-auto",
                          viewType === 'arrival' ? "bg-blue-500" : 
                          viewType === 'inhouse' ? "bg-green-500" : 
                          viewType === 'dueout' ? "bg-amber-500" : "bg-slate-500"
                        )}></div>
                        
                        <div className="flex-1 p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="font-mono">#{reservation.reservationNumber}</Badge>
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
                                  <span>{reservation.rooms?.[0].type}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users2 className="h-3.5 w-3.5" />
                                  <span>
                                    {reservation.rooms?.[0].adultCount || 0} Adults, {reservation.rooms?.[0].childCount || 0} Children
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
                                onClick={() => viewReservationDetails(reservation)}
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
                    <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No Reservations Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search query" 
                        : `No ${viewType === 'arrival' ? 'arrivals' : 
                           viewType === 'inhouse' ? 'in-house guests' : 
                           viewType === 'dueout' ? 'due-outs' : 'reservations'} for ${format(selectedDate, 'MMMM d, yyyy')}`}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Reservation Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl h-[90vh] max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                Reservation Details
                <Badge className="ml-2">#{selectedReservation?.reservationNumber}</Badge>
              </DialogTitle>
              <DialogDescription>
                View and manage reservation information
              </DialogDescription>
            </DialogHeader>
            
            {selectedReservation && (
              <div className="flex-1 overflow-hidden">
                <Tabs 
                  defaultValue="overview" 
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-full flex flex-col"
                >
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms & Guests</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex-1 overflow-y-auto">
                    <TabsContent value="overview" className="mt-0 h-full">
                      <Card className="border-none shadow-none">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="font-medium mb-2 flex items-center gap-1.5">
                                <UserCircle className="h-4 w-4 text-muted-foreground" />
                                Guest Information
                              </h3>
                              <Card className="bg-muted/10">
                                <CardContent className="p-4 space-y-4">
                                  <div className="flex items-start space-x-4">
                                    <div className="bg-primary/10 rounded-full p-3">
                                      <UserCircle className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-lg">{selectedReservation.guestName}</h4>
                                      <p className="text-muted-foreground text-sm">
                                        {selectedReservation.rooms?.[0]?.title} {selectedReservation.rooms?.[0]?.firstName} {selectedReservation.rooms?.[0]?.lastName}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {selectedReservation.booker?.agentName && (
                                      <div className="col-span-full">
                                        <p className="text-xs text-muted-foreground">Booked Via</p>
                                        <p className="font-medium flex items-center gap-1">
                                          <Badge variant="outline">{selectedReservation.booker.agentCode}</Badge>
                                          {selectedReservation.booker.agentName}
                                        </p>
                                      </div>
                                    )}
                                    
                                    <div>
                                      <p className="text-xs text-muted-foreground">Email</p>
                                      <p className="font-medium flex items-center gap-1">
                                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                        {selectedReservation.booker?.email || "Not provided"}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-muted-foreground">Phone</p>
                                      <p className="font-medium flex items-center gap-1">
                                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                        {selectedReservation.booker?.phone || "Not provided"}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-2 flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                Reservation Details
                              </h3>
                              <Card className="bg-muted/10">
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">Status</div>
                                    <div>{getStatusBadge(selectedReservation.status)}</div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">Check-in Date</div>
                                    <div className="font-medium flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5 text-green-500" />
                                      {format(new Date(selectedReservation.checkIn), 'MMM d, yyyy')}
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">Check-out Date</div>
                                    <div className="font-medium flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5 text-red-500" />
                                      {format(new Date(selectedReservation.checkOut), 'MMM d, yyyy')}
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">Length of Stay</div>
                                    <div className="font-medium">
                                      {selectedReservation.rooms?.[0]?.lengthOfStay || 1} {(selectedReservation.rooms?.[0]?.lengthOfStay || 1) > 1 ? 'nights' : 'night'}
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">Total Amount</div>
                                    <div className="font-medium text-lg">
                                      {selectedReservation.totalAmount?.toLocaleString()} {selectedReservation.currency}
                                    </div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Booked On</p>
                                      <p className="font-medium">
                                        {selectedReservation.createdAt ? format(new Date(selectedReservation.createdAt), 'MMM d, yyyy') : 'N/A'}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <p className="text-xs text-muted-foreground">Source Code</p>
                                      <p className="font-medium">
                                        {selectedReservation.sourceCode?.trim() || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h3 className="font-medium mb-2 flex items-center gap-1.5">
                              <BedDouble className="h-4 w-4 text-muted-foreground" />
                              Room Summary
                            </h3>
                            <Card>
                              <CardContent className="p-4">
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Room</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Guests</TableHead>
                                        <TableHead>Meal Plan</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedReservation.rooms?.map((room) => (
                                        <TableRow key={room.subReservationId}>
                                          <TableCell className="font-medium">{room.serialNumber}</TableCell>
                                          <TableCell>{room.type}</TableCell>
                                          <TableCell>
                                            {room.adultCount} Adults, {room.childCount} Children
                                          </TableCell>
                                          <TableCell>
                                            <span className="flex gap-1 items-center">
                                              <Badge variant="outline" className="font-mono">{room.mealPlan}</Badge>
                                              {getMealPlanFull(room.mealPlan)}
                                            </span>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {room.totalAmount.toLocaleString()} {selectedReservation.currency}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="rooms" className="mt-0">
                      <Card className="border-none shadow-none">
                        <CardContent className="p-0 space-y-6">
                          {selectedReservation.rooms?.map((room, index) => (
                            <Card key={room.subReservationId} className="overflow-hidden">
                              <CardHeader className="bg-muted/20 py-3">
                                <CardTitle className="text-lg flex items-center justify-between">
                                  <span className="flex items-center gap-2">
                                    <Badge variant="outline" className="font-mono">
                                      Room {room.serialNumber}
                                    </Badge>
                                    {room.type}
                                  </span>
                                  {getStatusBadge(room.status)}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                      <UserCircle className="h-3.5 w-3.5 text-muted-foreground" />
                                      Guest Information
                                    </h4>
                                    <div className="space-y-3 bg-muted/10 p-3 rounded-md">
                                      <div>
                                        <p className="text-xs text-muted-foreground">Name</p>
                                        <p className="font-medium">{room.title} {room.firstName} {room.lastName}</p>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground">Adults</p>
                                          <p className="font-medium">{room.adultCount}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">Children</p>
                                          <p className="font-medium">{room.childCount}</p>
                                        </div>
                                      </div>
                                      
                                      {room.mainGuest && (
                                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                          Primary Guest
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                      <BedDouble className="h-3.5 w-3.5 text-muted-foreground" />
                                      Stay Details
                                    </h4>
                                    <div className="space-y-3 bg-muted/10 p-3 rounded-md">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground">Check-in</p>
                                          <p className="font-medium">{formatTimestamp(room.checkInTime)}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">Check-out</p>
                                          <p className="font-medium">{formatTimestamp(room.checkOutTime)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground">Nights</p>
                                          <p className="font-medium">{room.lengthOfStay}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground">Meal Plan</p>
                                          <p className="font-medium flex items-center gap-1">
                                            <Badge variant="outline" className="font-mono">{room.mealPlan}</Badge>
                                            {getMealPlanFull(room.mealPlan)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="mt-4 flex justify-end gap-2">
                                  {room.status === 'booking' && (
                                    <Button variant="default" size="sm">
                                      Check In
                                    </Button>
                                  )}
                                  {room.status === 'checked-in' && (
                                    <Button variant="default" size="sm">
                                      Check Out
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm">
                                    Edit Details
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="billing" className="mt-0">
                      <Card className="border-none shadow-none">
                        <CardContent className="p-0">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium mb-3">Payment Summary</h3>
                              
                              <Card>
                                <CardContent className="p-4">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground">Room charges</span>
                                      <span>{selectedReservation.totalAmount?.toLocaleString()} {selectedReservation.currency}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                      <span className="text-muted-foreground">Taxes & Fees</span>
                                      <span>Included</span>
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div className="flex justify-between items-center font-medium text-lg">
                                      <span>Total</span>
                                      <span>{selectedReservation.totalAmount?.toLocaleString()} {selectedReservation.currency}</span>
                                    </div>
                                    
                                    <div className="mt-4">
                                      <Button className="w-full sm:w-auto">Process Payment</Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            
                            <div>
                              <h3 className="font-medium mb-3">Payment History</h3>
                              
                              <Card className="bg-muted/10">
                                <CardContent className="p-6 text-center">
                                  <p className="text-muted-foreground">
                                    No payment transactions recorded for this reservation yet.
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4">
              {selectedReservation?.status.toLowerCase() === 'confirmed' && (
                <Button>
                  Check In Guest
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Reservations;
