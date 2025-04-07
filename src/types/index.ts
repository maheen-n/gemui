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
  totalAmount: number;
  currency: string;
  displayName: string;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  amenities: string[];
  count: number;
}
