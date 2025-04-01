
// Add missing types related to SpaBooking functionality

export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  floor: number;
  capacity: number;
  price: number;
  amenities: string[];
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  image?: string;
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
  status: 'booked' | 'completed' | 'cancelled';
  therapistId: string;
  therapistName: string;
  roomId: string;
  createdAt: string;
}
