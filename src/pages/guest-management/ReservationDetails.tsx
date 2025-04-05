import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
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
  Building2,
  Home,
  Receipt,
  Utensils,
  Link as LinkIcon,
  ArrowRightCircle,
  MapPin,
  CheckCheck,
  ClipboardCheck,
  AlertCircle,
  RotateCcw,
  Star,
  CirclePlus,
  CircleMinus,
  FileEdit
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    roomNumber?: string;
    address?: string;
    preCheckinLink?: string;
    guestAppLink?: string;
  }[];
  totalAmount?: number;
  currency?: string;
  displayName?: string;
  propertyCode?: string;
  earliestCheckInTime?: number;
  latestCheckOutTime?: number;
  activities?: ReservationActivity[];
}

interface ReservationActivity {
  id: string;
  type: 'booking' | 'check-in' | 'check-out' | 'payment' | 'room-change' | 'feedback' | 'note' | 'cancel' | 'modification';
  timestamp: number;
  description: string;
  user?: string;
  details?: string;
  roomId?: string;
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
        checkOutTime: 1743658200000,
        roomNumber: "301",
        address: "3rd Floor, West Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/42751-2425-1",
        guestAppLink: "https://app.hotel.com/guest/42751-2425-1"
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
        checkOutTime: 1743658200000,
        roomNumber: "302",
        address: "3rd Floor, West Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/42751-2425-2",
        guestAppLink: "https://app.hotel.com/guest/42751-2425-2"
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
        checkOutTime: 1743658200000,
        roomNumber: "303",
        address: "3rd Floor, East Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/42751-2425-3",
        guestAppLink: "https://app.hotel.com/guest/42751-2425-3"
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
        checkOutTime: 1743658200000,
        roomNumber: "304",
        address: "3rd Floor, East Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/42751-2425-4",
        guestAppLink: "https://app.hotel.com/guest/42751-2425-4"
      }
    ],
    totalAmount: 245280.0,
    currency: "INR",
    displayName: "MICHAEL GROUP",
    propertyCode: "HTLBOM",
    earliestCheckInTime: 1743582600000,
    latestCheckOutTime: 1743658200000,
    activities: [
      {
        id: "act-1",
        type: "booking",
        timestamp: 1711126800000, // 2025-03-20
        description: "Reservation Created",
        user: "Booking System",
        details: "Reservation #42751-2425 was created with 4 room(s)"
      },
      {
        id: "act-2",
        type: "payment",
        timestamp: 1711126800000, // 2025-03-20
        description: "Payment Received",
        details: "Payment of 245,280 INR received"
      },
      {
        id: "act-3",
        type: "modification",
        timestamp: 1711213200000, // 2025-03-21
        description: "Reservation Modified",
        user: "John Smith",
        details: "Added special request: Late check-out requested"
      },
      {
        id: "act-4",
        type: "check-in",
        timestamp: 1743582600000, // 2025-03-30
        description: "Check-in",
        user: "Front Desk",
        details: "Guest checked in to Room 301",
        roomId: "42751-2425-1"
      },
      {
        id: "act-5",
        type: "check-in",
        timestamp: 1743582840000, // 2025-03-30 (a bit later)
        description: "Check-in",
        user: "Front Desk",
        details: "Guest checked in to Room 302",
        roomId: "42751-2425-2"
      },
      {
        id: "act-6",
        type: "room-change",
        timestamp: 1743600000000, // 2025-03-30 (later in the day)
        description: "Room Change",
        user: "Front Desk",
        details: "Room 304 changed to Room 306 due to AC issue",
        roomId: "42751-2425-4"
      },
      {
        id: "act-7",
        type: "feedback",
        timestamp: 1743630000000, // 2025-03-30 (evening)
        description: "Feedback Added",
        user: "Guest",
        details: "Room service was excellent - 5 stars"
      }
    ]
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
        checkOutTime: 1743917400000,
        roomNumber: "501",
        address: "5th Floor, Royal Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/20449-2425-1",
        guestAppLink: "https://app.hotel.com/guest/20449-2425-1"
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
        checkOutTime: 1743917400000,
        roomNumber: "205",
        address: "2nd Floor, Standard Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/20449-2425-2",
        guestAppLink: "https://app.hotel.com/guest/20449-2425-2"
      }
    ],
    totalAmount: 20000.0,
    currency: "USD",
    propertyCode: "HTLDEL",
    earliestCheckInTime: 1743582600000,
    latestCheckOutTime: 1743917400000,
    activities: [
      {
        id: "act-1",
        type: "booking",
        timestamp: 1711126800000, // 2025-03-20
        description: "Reservation Created",
        user: "Booking System",
        details: "Reservation #20449-2425 was created with 2 room(s)"
      },
      {
        id: "act-2",
        type: "payment",
        timestamp: 1711126800000, // 2025-03-20
        description: "Payment Received",
        details: "Payment of 20,000 USD received"
      }
    ]
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
        checkOutTime: 1744100600000,
        roomNumber: "601",
        address: "6th Floor, Executive Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/55672-2425-1",
        guestAppLink: "https://app.hotel.com/guest/55672-2425-1"
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
        checkOutTime: 1744100600000,
        roomNumber: "602",
        address: "6th Floor, Executive Wing",
        preCheckinLink: "https://checkin.hotel.com/pre/55672-2425-2",
        guestAppLink: "https://app.hotel.com/guest/55672-2425-2"
      }
    ],
    totalAmount: 30000.0,
    currency: "USD",
    propertyCode: "HTLCHI",
    earliestCheckInTime: 1743669000000,
    latestCheckOutTime: 1744100600000
  }
];

const ReservationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('rooms');
  const [reservation, setReservation] = useState<ExtendedReservation | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ExtendedReservation['rooms'][0] | null>(null);
  
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
    return format(new Date(timestamp), 'dd MMM yyyy, hh:mm a');
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
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-6 w-6 text-blue-500" />;
      case 'check-in':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'check-out':
        return <LogOutIcon className="h-6 w-6 text-muted-foreground" />;
      case 'payment':
        return <DollarSign className="h-6 w-6 text-green-600" />;
      case 'room-change':
        return <RotateCcw className="h-6 w-6 text-amber-500" />;
      case 'feedback':
        return <Star className="h-6 w-6 text-yellow-500" />;
      case 'note':
        return <FileEdit className="h-6 w-6 text-blue-400" />;
      case 'cancel':
        return <CircleMinus className="h-6 w-6 text-red-500" />;
      case 'modification':
        return <Pencil className="h-6 w-6 text-purple-500" />;
      default:
        return <ClipboardCheck className="h-6 w-6 text-gray-500" />;
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

  const handleOpenRoomDetails = (room: ExtendedReservation['rooms'][0]) => {
    setSelectedRoom(room);
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">
                    {reservation.displayName || reservation.guestName}
                  </CardTitle>
                  <div>
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
                <CardDescription className="flex items-center text-sm">
                  <span className="font-medium">Reservation ID:</span>
                  <span className="font-mono text-muted-foreground ml-2">#{reservation.reservationNumber}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Rooms</p>
                    <p className="font-medium flex items-center">
                      <BedDouble className="h-4 w-4 mr-1 text-muted-foreground" />
                      {reservation.rooms?.length || 0}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                      {reservation.totalAmount?.toLocaleString()} {reservation.currency}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Check In</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-green-500" />
                      {reservation.earliestCheckInTime ? formatTimestamp(reservation.earliestCheckInTime) : format(new Date(reservation.checkIn), 'dd MMM yyyy')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Check Out</p>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-red-500" />
                      {reservation.latestCheckOutTime ? formatTimestamp(reservation.latestCheckOutTime) : format(new Date(reservation.checkOut), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Length of stay</p>
                    <p className="font-medium">
                      {reservation.rooms?.[0]?.lengthOfStay || 1} {reservation.rooms?.[0]?.lengthOfStay === 1 ? 'Night' : 'Nights'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">PAX</p>
                    <p className="font-medium flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {reservation.pax}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Serial Number</p>
                    <p className="font-medium">{reservation.serialNumber}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Property Code</p>
                    <p className="font-medium">{reservation.propertyCode || reservation.entityCode}</p>
                  </div>
                </div>
                
                {reservation.booker && (
                  <div>
                    <p className="text-xs text-muted-foreground">Booked Via</p>
                    <p className="font-medium flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {reservation.booker.agentCode && (
                        <Badge variant="outline" className="font-mono">
                          {reservation.booker.agentCode}
                        </Badge>
                      )}
                      {reservation.booker.agentName || reservation.booker.name}
                    </p>
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
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
                </div>
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
                          <TableHead>Sub-Res ID</TableHead>
                          <TableHead>Room Type</TableHead>
                          <TableHead>Room No.</TableHead>
                          <TableHead>Guest</TableHead>
                          <TableHead>Check In/Out</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reservation.rooms?.map((room) => (
                          <TableRow key={room.subReservationId}>
                            <TableCell className="font-mono text-xs">
                              {room.subReservationId}
                            </TableCell>
                            <TableCell>
                              {room.type}
                            </TableCell>
                            <TableCell>
                              {room.roomNumber || "-"}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {room.title} {room.firstName} {room.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {room.adultCount} Adult{room.adultCount !== 1 ? 's' : ''}{room.childCount > 0 ? `, ${room.childCount} Child${room.childCount !== 1 ? 'ren' : ''}` : ''}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-xs">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1 text-green-500" />
                                  {format(new Date(room.checkInTime), 'dd MMM')}
                                </div>
                                <div className="flex items-center mt-1">
                                  <Calendar className="h-3 w-3 mr-1 text-red-500" />
                                  {format(new Date(room.checkOutTime), 'dd MMM')}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(room.status)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleOpenRoomDetails(room)}
                              >
                                <ArrowRightCircle className="h-4 w-4" />
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
                    <CardTitle>Activity Timeline</CardTitle>
                    <CardDescription>
                      Complete history of activities for this reservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-px bg-border"></div>

                      <div className="space-y-8 relative">
                        {reservation.activities && reservation.activities.length > 0 ? (
                          [...reservation.activities]
                            .sort((a, b) => b.timestamp - a.timestamp)
                            .map((activity) => (
                              <div key={activity.id} className="relative pl-12">
                                <div className="absolute left-0 top-0 bg-card p-1.5 rounded-full border">
                                  {getActivityIcon(activity.type)}
                                </div>

                                <div className="bg-card border rounded-lg p-4">
                                  <div className="flex justify-between mb-2">
                                    <div className="font-medium">{activity.description}</div>
                                    <div className="text-muted-foreground text-sm">
                                      {formatTimestamp(activity.timestamp)}
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground mb-2">
                                    {activity.details}
                                  </div>
                                  {activity.user && (
                                    <div className="text-xs flex items-center">
                                      <UserCircle className="h-3 w-3 mr-1.5 text-muted-foreground" />
                                      <span>By: {activity.user}</span>
                                    </div>
                                  )}
                                  {activity.roomId && (
                                    <div className="text-xs flex items-center mt-1">
                                      <BedDouble className="h-3 w-3 mr-1.5 text-muted-foreground" />
                                      <span>Room: {activity.roomId}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 text-center">
                            <ClipboardCheck className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No activity records</h3>
                            <p className="text-muted-foreground mt-1">
                              Activity records for this reservation will appear here
                            </p>
                          </div>
                        )}
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

        {selectedRoom && (
          <Sheet open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
            <SheetContent className="sm:max-w-md overflow-y-auto backdrop-blur-md bg-background/95 border-l-2">
              <SheetHeader className="mb-6">
                <SheetTitle>Room Details</SheetTitle>
                <SheetDescription>
                  Booking #{selectedRoom.subReservationId}
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{selectedRoom.type}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRoom.roomNumber ? `Room ${selectedRoom.roomNumber}` : 'Not Assigned'}</p>
                  </div>
                  {getStatusBadge(selectedRoom.status)}
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Guest Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <UserCircle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p>{selectedRoom.title} {selectedRoom.firstName} {selectedRoom.lastName}</p>
                        <p className="text-muted-foreground">{selectedRoom.mainGuest ? 'Main Guest' : 'Additional Guest'}</p>
                      </div>
                    </div>
                    
                    {reservation.booker?.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{reservation.booker.email}</span>
                      </div>
                    )}
                    
                    {reservation.booker?.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{reservation.booker.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Stay Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">Check-in:</p>
                        <p className="font-medium">{formatTimestamp(selectedRoom.checkInTime)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Check-out:</p>
                        <p className="font-medium">{formatTimestamp(selectedRoom.checkOutTime)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Length of Stay:</p>
                      <p className="font-medium">{selectedRoom.lengthOfStay} {selectedRoom.lengthOfStay === 1 ? 'Night' : 'Nights'}</p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Meal Plan:</p>
                      <div className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2" />
                        <p className="font-medium">{getMealPlanFull(selectedRoom.mealPlan)}</p>
                      </div>
                    </div>
                    
                    {selectedRoom.address && (
                      <div>
                        <p className="text-muted-foreground">Room Location:</p>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <p>{selectedRoom.address}</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-muted-foreground">Amount:</p>
                      <div className="flex items-center">
                        <Receipt className="h-4 w-4 mr-2" />
                        <p className="font-medium">{selectedRoom.totalAmount.toLocaleString()} {reservation.currency}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Occupancy:</p>
                      <p className="font-medium">
                        {selectedRoom.adultCount} Adult{selectedRoom.adultCount !== 1 ? 's' : ''}
                        {selectedRoom.childCount > 0 ? `, ${selectedRoom.childCount} Child${selectedRoom.childCount !== 1 ? 'ren' : ''}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                
                {(selectedRoom.preCheckinLink || selectedRoom.guestAppLink) && (
                  <>
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Guest Links</h4>
                      <div className="space-y-2">
                        {selectedRoom.preCheckinLink && (
                          <div className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <a href={selectedRoom.preCheckinLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              Pre Check-in Link
                            </a>
                          </div>
                        )}
                        
                        {selectedRoom.guestAppLink && (
                          <div className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                            <a href={selectedRoom.guestAppLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              Guest App Link
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                <Separator />
                
                <div className="flex justify-end gap-2 pt-4">
                  {selectedRoom.status === 'booking' && (
                    <Button onClick={() => handleCheckIn(selectedRoom.subReservationId)}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Check In
                    </Button>
                  )}
                  
                  {selectedRoom.status === 'checked-in' && (
                    <Button onClick={() => handleCheckOut(selectedRoom.subReservationId)}>
                      <LogOutIcon className="mr-2 h-4 w-4" /> Check Out
                    </Button>
                  )}
                  
                  <Button variant="outline" onClick={() => handleEditDetails(selectedRoom.subReservationId)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit Details
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReservationDetails;
