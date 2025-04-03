
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  UserCircle,
  Phone,
  Mail,
  Calendar,
  BedDouble,
  Users,
  CheckCircle,
  LogOut as LogOutIcon,
  ArrowLeft,
  Pencil,
  Clock,
  DollarSign
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Define the extended reservation type
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

// Dummy data to display
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
    status: "booking",
    createdAt: "2025-03-20",
    booker: {
      name: "RAFEEQ ALI",
      email: "p2htwvekox@m.expediapartnercentral.com",
      phone: "+919714357520",
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
        totalAmount: 5206.0,
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
    status: "booking",
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
    status: "booking",
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

const ReservationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [reservation, setReservation] = useState<ExtendedReservation | null>(null);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const foundReservation = guestReservationsData.find(res => res.id === id);
    if (foundReservation) {
      setReservation(foundReservation);
    }
  }, [id]);
  
  if (!reservation) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/guest-management/reservations')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reservations
          </Button>
          <div className="text-center py-12">
            <h3 className="text-xl font-medium">Reservation not found</h3>
            <p className="text-muted-foreground mt-2">The reservation you're looking for doesn't exist or has been removed</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
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
  
  const handleCheckIn = (roomId: string) => {
    toast({
      title: "Room checked in",
      description: `Room ${roomId} has been checked in successfully.`,
    });
  };

  const handleCheckOut = (roomId: string) => {
    toast({
      title: "Room checked out",
      description: `Room ${roomId} has been checked out successfully.`,
    });
  };

  const handleEditDetails = (roomId: string) => {
    toast({
      title: "Edit room details",
      description: `Editing details for room ${roomId}.`,
    });
  };
  
  const handleGoBack = () => {
    // Check if we were referred from room planning
    if (location.state?.from === 'room-planning') {
      navigate('/room-planning');
    } else {
      navigate('/guest-management/reservations');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={handleGoBack}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Reservation Details</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="font-mono text-base">{reservation.id}</Badge>
              {getStatusBadge(reservation.status)}
            </div>
          </div>
          
          {reservation.status === 'booking' && (
            <Button 
              onClick={() => toast({
                title: "Reservation checked in",
                description: `All rooms for reservation ${reservation.id} have been checked in.`
              })}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Check In All Rooms
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="rooms">Rooms & Guests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3">
                      <UserCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{reservation.guestName}</h4>
                      <p className="text-muted-foreground text-sm">
                        {reservation.rooms?.[0]?.title} {reservation.rooms?.[0]?.firstName} {reservation.rooms?.[0]?.lastName}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reservation.booker?.agentName && (
                      <div className="col-span-full">
                        <p className="text-xs text-muted-foreground">Booked Via</p>
                        <p className="font-medium flex items-center gap-1">
                          <Badge variant="outline">{reservation.booker.agentCode}</Badge>
                          {reservation.booker.agentName}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {reservation.booker?.email || "Not provided"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {reservation.booker?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Reservation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div>{getStatusBadge(reservation.status)}</div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Check-in Date</div>
                    <div className="font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-green-500" />
                      {format(new Date(reservation.checkIn), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Check-out Date</div>
                    <div className="font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-red-500" />
                      {format(new Date(reservation.checkOut), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Length of Stay</div>
                    <div className="font-medium">
                      {reservation.rooms?.[0]?.lengthOfStay || 1} {(reservation.rooms?.[0]?.lengthOfStay || 1) > 1 ? 'nights' : 'night'}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="font-medium text-lg">
                      {reservation.totalAmount?.toLocaleString()} {reservation.currency}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Reservation #</p>
                      <p className="font-medium">
                        {reservation.reservationNumber}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground">Booked On</p>
                      <p className="font-medium">
                        {reservation.createdAt ? format(new Date(reservation.createdAt), 'MMM d, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-muted-foreground" />
                  Room Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Meal Plan</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservation.rooms?.map((room) => (
                      <TableRow key={room.subReservationId}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>#{room.serialNumber}</span>
                            <span className="text-xs text-muted-foreground">{room.subReservationId}</span>
                          </div>
                        </TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>
                          {room.title} {room.firstName} {room.lastName}
                          {room.mainGuest && (
                            <Badge variant="secondary" className="ml-1 text-xs">Primary</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {room.adultCount} Adults, {room.childCount} Children
                        </TableCell>
                        <TableCell>
                          <span className="flex gap-1 items-center">
                            <Badge variant="outline" className="font-mono">{room.mealPlan}</Badge>
                            <span className="text-xs">{getMealPlanFull(room.mealPlan)}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {room.totalAmount.toLocaleString()} {reservation.currency}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {room.status === 'booking' && (
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => handleCheckIn(room.subReservationId)}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Check In
                              </Button>
                            )}
                            {room.status === 'checked-in' && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleCheckOut(room.subReservationId)}
                              >
                                <LogOutIcon className="h-3.5 w-3.5 mr-1" />
                                Check Out
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditDetails(room.subReservationId)}
                            >
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rooms" className="space-y-6">
            {reservation.rooms?.map((room, index) => (
              <Card key={room.subReservationId} className="overflow-hidden">
                <CardHeader className="bg-muted/20 py-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        Room {room.serialNumber}
                      </Badge>
                      <span className="text-xs text-muted-foreground">(ID: {room.subReservationId})</span>
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
                        
                        <div>
                          <p className="text-xs text-muted-foreground">Room Rate</p>
                          <p className="font-medium flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            {room.totalAmount.toLocaleString()} {reservation.currency}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    {room.status === 'booking' && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleCheckIn(room.subReservationId)}
                        className="flex items-center gap-1.5"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Check In
                      </Button>
                    )}
                    {room.status === 'checked-in' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleCheckOut(room.subReservationId)}
                        className="flex items-center gap-1.5"
                      >
                        <LogOutIcon className="h-3.5 w-3.5" />
                        Check Out
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditDetails(room.subReservationId)}
                      className="flex items-center gap-1.5"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ReservationDetails;
