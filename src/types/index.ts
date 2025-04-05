
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
  totalAmount?: number;  // Added the missing property
  currency?: string;     // Adding this as it's used with totalAmount
  displayName?: string;  // Adding this as it might be used in the component
}
