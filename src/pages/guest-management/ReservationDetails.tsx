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
  DollarSign,
  MessageSquare,
  FileText,
  Building2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const guestReservationsData: ExtendedReservation[] = [
  {
    id: "42751-2425",
    reservationNumber: "42751-2425",
    guestName: "MICHAEL GROUP",
    checkIn: "2025-03-30",
    checkOut: "2025-03-31",
    serialNumber: "01",
    entityCode: "SV",
    roomTypeId: "1",
    pax: 8,
    status: "booking",
    createdAt: "2025-03-20",
    booker: {
      name: "MICHAEL GROUP",
      email: "inbound1@intersight.in",
      phone: "+919148433210008",
      agentCode: "A2439",
      agentName: "EXPEDIA TRAVEL"
    },
    rooms: [
      {
        subReservationId: "42751-2425-1",
        serialNumber: "01",
        type: "Executive Room",
        title: "MR.",
        firstName: "Juzer",
        lastName: "",
        lengthOfStay: 1,
        totalAmount: 61320.0,
        status: "booking",
        mainGuest: true,
        adultCount: 2,
        childCount: 0,
        mealPlan: "CP",
        checkInTime: 1743582600000,
        checkOutTime: 1743658200000
      },
      {
        subReservationId: "42751-2425-2",
        serialNumber: "02",
        type: "Executive Room",
        title: "MR.",
        firstName: "Juzer",
        lastName: "",
        lengthOfStay: 1,
        totalAmount: 61320.0,
        status: "booking",
        mainGuest: false,
        adultCount: 2,
        childCount: 0,
        mealPlan: "CP",
        checkInTime: 1743582600000,
        checkOutTime: 1743658200000
      },
      {
        subReservationId: "42751-2425-3",
        serialNumber: "03",
        type: "Executive Room",
        title: "MR.",
        firstName: "Juzer",
        lastName: "",
        lengthOfStay: 1,
        totalAmount: 61320.0,
        status: "booking",
        mainGuest: false,
        adultCount: 2,
        childCount: 0,
        mealPlan: "CP",
        checkInTime: 1743582600000,
        checkOutTime: 1743658200000
      },
      {
        subReservationId: "42751-2425-4",
        serialNumber: "04",
        type: "Executive Room",
        title: "MR.",
        firstName: "Juzer",
        lastName: "",
        lengthOfStay: 1,
        totalAmount: 61320.0,
        status: "booking",
        mainGuest: false,
        adultCount: 2,
        childCount: 0,
        mealPlan: "CP",
        checkInTime: 1743582600000,
        checkOutTime: 1743658200000
      }
    ],
    totalAmount: 245280.0,
    currency: "INR",
    displayName: "MICHAEL GROUP"
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
  const [activeTab, setActiveTab] = useState<string>('rooms');
  const [reservation, setReservation] = useState<ExtendedReservation | null>(null);
  
  useEffect(() => {
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
    return format(new Date(timestamp), 'dd MMM, yyyy hh:mm a');
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
    if (location.state?.from === 'room-planning') {
      navigate('/room-planning');
    } else {
      navigate('/guest-management/reservations');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold flex items-center justify-between">
                  <div>
                    {reservation.displayName || reservation.guestName}
                  </div>
                  <div>
                    {getStatusBadge(reservation.status)}
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <span className="font-mono text-muted-foreground">#{reservation.reservationNumber}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reservation.booker?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.booker.email}</span>
                  </div>
                )}
                
                {reservation.booker?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{reservation.booker.phone}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Check In</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {format(new Date(reservation.checkIn), 'dd MMM yy')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Check Out</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-red-500" />
                      {format(new Date(reservation.checkOut), 'dd MMM yy')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Length of stay</p>
                    <p className="font-medium">
                      {reservation.rooms?.[0]?.lengthOfStay || 1} Night
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Total amount</p>
                    <p className="font-medium">
                      {reservation.totalAmount?.toLocaleString()} {reservation.currency}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Room Status</p>
                    <p className="font-medium flex items-center">
                      <Badge variant="outline" className="rounded-full px-2">
                        {reservation.rooms?.length || 0}
                      </Badge>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Serial Number</p>
                    <p className="font-medium">{reservation.serialNumber}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Entity Code</p>
                    <p className="font-medium">{reservation.entityCode}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">PAX</p>
                    <p className="font-medium flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {reservation.pax}
                    </p>
                  </div>
                </div>
                
                {reservation.booker?.agentName && (
                  <div>
                    <p className="text-xs text-muted-foreground">Booked Via</p>
                    <p className="font-medium flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <Badge variant="outline" className="font-mono">
                        {reservation.booker.agentCode}
                      </Badge>
                      {reservation.booker.agentName}
                    </p>
                  </div>
                )}
                
                {reservation.status === 'booking' && (
                  <div className="pt-2">
                    <Button className="w-full" onClick={() => {
                      toast({
                        title: "Reservation checked in",
                        description: `All rooms for reservation ${reservation.id} have been checked in.`
                      });
                    }}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Check In All Rooms
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="rooms" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
              </TabsList>
              
              <TabsContent value="rooms" className="mt-4">
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Room</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Arrival / Departure</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservation.rooms?.map((room) => (
                          <TableRow key={room.subReservationId}>
                            <TableCell>
                              {room.roomNumber || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {room.firstName} {room.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                #{room.subReservationId}
                              </div>
                            </TableCell>
                            <TableCell>
                              {reservation.booker?.phone || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="flex items-center text-sm">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-green-500" />
                                  {formatTimestamp(room.checkInTime)}
                                </span>
                                <span className="flex items-center text-sm">
                                  <Calendar className="h-3.5 w-3.5 mr-1 text-red-500" />
                                  {formatTimestamp(room.checkOutTime)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(room.status)}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="text-blue-500">
                                <ArrowLeft className="h-4 w-4 rotate-180" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Log</CardTitle>
                    <CardDescription>
                      Recent activities for this reservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Reservation Created</div>
                          <div className="text-muted-foreground text-sm">
                            {format(new Date(reservation.createdAt), 'dd MMM yyyy, hh:mm a')}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reservation #{reservation.reservationNumber} was created with {reservation.rooms?.length} room(s)
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <div className="font-medium">Payment Received</div>
                          <div className="text-muted-foreground text-sm">
                            {format(new Date(reservation.createdAt), 'dd MMM yyyy, hh:mm a')}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Payment of {reservation.totalAmount?.toLocaleString()} {reservation.currency} received
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="communication" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication</CardTitle>
                    <CardDescription>
                      Messages and communication history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No messages yet</h3>
                      <p className="text-muted-foreground mt-1">
                        Communications with the guest will appear here
                      </p>
                      <Button className="mt-4">
                        <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReservationDetails;
