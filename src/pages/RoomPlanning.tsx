
const reservation: Reservation = {
  id: reservationId,
  guestName,
  reservationNumber: `RES${(1000 + id).toString()}`,
  pax,
  checkIn: format(checkIn, 'yyyy-MM-dd'),
  checkOut: format(checkOut, 'yyyy-MM-dd'),
  roomTypeId: roomType.id,
  roomNumber,
  status: 'confirmed',
  createdAt: format(addDays(checkIn, -10), 'yyyy-MM-dd'),
  totalAmount: roomType.price ? roomType.price * stayDuration : undefined,
  currency: 'USD',
  displayName: guestName
} as const;
