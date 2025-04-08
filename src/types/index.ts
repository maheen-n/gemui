

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

// Types for inventory tracking
export interface InventoryTransaction {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  roomId?: string;
  roomNumber?: string;
  transactionType: 'taken' | 'returned';
  items: InventoryTransactionItem[];
}

export interface InventoryTransactionItem {
  amenityId: string;
  amenityName: string;
  count: number;
  category: string;
}

