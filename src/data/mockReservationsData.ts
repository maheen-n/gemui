import { Reservation } from '@/types';

// Generate 200 reservations (100 for April 2025, 100 for May 2025)
const generateMockReservations = (): Reservation[] => {
  const reservations: Reservation[] = [];
  const roomTypes = ['1', '2', '3', '4'];
  const statuses: ('booking' | 'confirmed')[] = ['booking', 'confirmed'];
  const guestNamePrefixes = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
    'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
    'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
    'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Patel'
  ];

  // Function to generate a random date within a month
  const getRandomDate = (month: number) => {
    const day = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month overflow
    return `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  // Function to get room price based on room type
  const getRoomPrice = (roomTypeId: string): number => {
    switch (roomTypeId) {
      case '1': return 5206;  // Executive Room
      case '2': return 8000;  // Deluxe Room
      case '3': return 15000; // Family Suite
      case '4': return 12000; // Suite
      default: return 5000;
    }
  };

  // Generate April reservations
  for (let i = 0; i < 100; i++) {
    const roomTypeId = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const checkIn = getRandomDate(4);
    const stayDuration = Math.floor(Math.random() * 5) + 1; // 1-5 days
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + stayDuration);
    
    const prefix = guestNamePrefixes[Math.floor(Math.random() * guestNamePrefixes.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const guestName = `${prefix} ${lastName}`;
    const pax = roomTypeId === '3' ? Math.floor(Math.random() * 2) + 3 : // 3-4 for Family Suite
                roomTypeId === '4' ? Math.floor(Math.random() * 2) + 2 : // 2-3 for Suite
                Math.floor(Math.random() * 2) + 1; // 1-2 for other rooms

    reservations.push({
      id: `RES-2425-04${(i + 1).toString().padStart(3, '0')}`,
      guestName,
      reservationNumber: `42${(750 + i).toString()}-2425-${String.fromCharCode(65 + (i % 26))}${roomTypeId}`,
      pax,
      checkIn,
      checkOut: checkOutDate.toISOString().split('T')[0],
      roomTypeId,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: '2025-03-15',
      totalAmount: getRoomPrice(roomTypeId) * stayDuration,
      currency: 'INR',
      displayName: `${lastName} FAMILY`
    });
  }

  // Generate May reservations
  for (let i = 0; i < 100; i++) {
    const roomTypeId = roomTypes[Math.floor(Math.random() * roomTypes.length)];
    const checkIn = getRandomDate(5);
    const stayDuration = Math.floor(Math.random() * 5) + 1; // 1-5 days
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + stayDuration);
    
    const prefix = guestNamePrefixes[Math.floor(Math.random() * guestNamePrefixes.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const guestName = `${prefix} ${lastName}`;
    const pax = roomTypeId === '3' ? Math.floor(Math.random() * 2) + 3 : // 3-4 for Family Suite
                roomTypeId === '4' ? Math.floor(Math.random() * 2) + 2 : // 2-3 for Suite
                Math.floor(Math.random() * 2) + 1; // 1-2 for other rooms

    reservations.push({
      id: `RES-2425-05${(i + 1).toString().padStart(3, '0')}`,
      guestName,
      reservationNumber: `42${(850 + i).toString()}-2425-${String.fromCharCode(65 + (i % 26))}${roomTypeId}`,
      pax,
      checkIn,
      checkOut: checkOutDate.toISOString().split('T')[0],
      roomTypeId,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: '2025-04-01',
      totalAmount: getRoomPrice(roomTypeId) * stayDuration,
      currency: 'INR',
      displayName: `${lastName} FAMILY`
    });
  }

  return reservations.sort((a, b) => a.checkIn.localeCompare(b.checkIn));
};

export const mockReservations = generateMockReservations();
