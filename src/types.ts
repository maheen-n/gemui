
export interface Reservation {
  id: string;
  reservationNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomTypeId: string;
  pax: number;
  status: string;
  createdAt: string;
  roomNumber?: string;
} 
