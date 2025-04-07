
import { Reservation } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import React from "react";

/**
 * Filters reservations by status, date, and search query
 */
export const filterReservations = (
  reservations: Reservation[],
  status: string = 'booking',
  selectedDate: Date,
  searchQuery: string = ''
): Reservation[] => {
  let filtered = reservations.filter(reservation => reservation.status === status);
  
  // Apply date filter
  filtered = filtered.filter(reservation => 
    format(new Date(reservation.checkIn), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  // Apply search filter if query exists
  if (searchQuery) {
    filtered = filtered.filter(reservation =>
      reservation.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.reservationNumber.includes(searchQuery)
    );
  }

  return filtered;
};

/**
 * Returns appropriate Badge component for a reservation status
 */
export const getStatusBadge = (status: string): React.ReactNode => {
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
