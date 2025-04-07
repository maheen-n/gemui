
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
  totalAmount?: number;  // Ensure this is optional
  currency?: string;     // Ensure this is optional
  displayName?: string;  // Ensure this is optional
}
