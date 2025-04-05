
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
  totalAmount?: number;  // Added optional totalAmount
  currency?: string;     // Added optional currency
  displayName?: string;  // Added optional displayName
}
