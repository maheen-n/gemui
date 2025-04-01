export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  position?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  address: string;
  passportNumber?: string;
  notes?: string;
  vipStatus?: boolean;
  lastStay?: string;
  totalStays?: number;
  createdAt: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  floor: string;
  capacity: number;
  rate: number;
  amenities: string[];
  lastCleaned?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  department: string;
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  createdAt: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  location: string;
  requestedBy: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface LostItem {
  id: string;
  name: string;
  description: string;
  location: string;
  reportedBy: string;
  status: 'reported' | 'found' | 'returned' | 'unclaimed';
  category: string;
  reportedAt: string;
  foundAt?: string;
}

export interface Inspection {
  id: string;
  area: string;
  inspector: string;
  status: 'pending' | 'passed' | 'failed';
  score?: number;
  notes?: string;
  date: string;
  items: {
    id: string;
    name: string;
    status: 'passed' | 'failed' | 'na';
    note?: string;
  }[];
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  staffCount: number;
  description: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  organizer: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  attendees: number;
}

export interface Budget {
  id: string;
  department: string;
  amount: number;
  spent: number;
  remaining: number;
  fiscalYear: string;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

// New types for Room Planning
export interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  count: number;
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
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  createdAt: string;
}
