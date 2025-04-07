
// Add missing types related to SpaBooking functionality

export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  floor: number;
  capacity: number;
  price?: number; // Make price optional
  rate: number; // Add rate property which is used in Rooms.tsx
  amenities: string[];
  lastCleaned?: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image?: string;
  count: number;
}

export interface SpaService {
  id: string;
  name: string;
  description: string;
  durations: SpaServiceDuration[];
  genderCriteria: 'all' | 'male' | 'female' | 'couples';
  preparationTime: number;
  category: string;
}

export interface SpaServiceDuration {
  id: string;
  minutes: number;
  price: number;
}

export interface SpaBooking {
  id: string;
  guestId: string;
  guestName: string;
  serviceId: string;
  serviceName: string;
  durationId: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  status: 'booked' | 'completed' | 'cancelled' | 'no-show';
  therapistId?: string;
  therapistName?: string;
  roomId?: string;
  specialRequests?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  reservationNumber: string;
  pax: number;
  checkIn: string;
  checkOut: string;
  roomTypeId: string;
  roomNumber?: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'booking';
  createdAt: string;
}

// Type alias for Reservation to avoid conflicts in Reservations.tsx
export type GuestReservation = Reservation;

// Updated SpaBookingModal props to include editingBooking property
export interface SpaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: SpaService | null;
  duration: SpaServiceDuration | null;
  selectedDate: Date;
  selectedTimeSlot: string | null;
  onSubmit: (bookingData: any) => void;
  isCustomBooking: boolean;
  services: SpaService[];
  editingBooking: SpaBooking | null;
  allowTimeChange?: boolean;
}

// New types for Amenity Tracking
export interface Amenity {
  id: string;
  name: string;
  description?: string;
  category: string;
  defaultCount: number;
  image?: string;
}

export interface RoomAmenityConfig {
  roomTypeId: string;
  amenityId: string;
  count: number;
}

export interface CleaningType {
  id: string;
  name: string;
  description: string;
  amenityMultiplier: number;
  estimatedDuration: number;
}

export interface AmenityLog {
  id: string;
  roomId: string;
  roomNumber: string;
  staffId: string;
  staffName: string;
  date: string;
  cleaningTypeId: string;
  amenities: AmenityLogItem[];
}

export interface AmenityLogItem {
  amenityId: string;
  amenityName: string;
  count: number;
}

// New types for MiniBar Management
export interface MiniBarItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  defaultCount: number;
  price: number;
  image?: string;
}

export interface RoomMiniBarConfig {
  roomTypeId: string;
  miniBarItemId: string;
  count: number;
}

export interface MiniBarLog {
  id: string;
  roomId: string;
  roomNumber: string;
  staffId: string;
  staffName: string;
  date: string;
  items: MiniBarLogItem[];
  totalCharge: number;
}

export interface MiniBarLogItem {
  itemId: string;
  itemName: string;
  consumed: number;
  price: number;
}

