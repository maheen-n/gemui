
import { InventoryTransaction, Amenity } from '@/types';
import { format, parseISO, isWithinInterval, subDays } from 'date-fns';

// Mock data for inventory transactions
export const mockInventoryTransactions: InventoryTransaction[] = [
  {
    id: '1',
    staffId: 'staff1',
    staffName: 'Sarah Johnson',
    date: new Date(2025, 3, 7, 9, 30).toISOString(),
    roomId: '101',
    roomNumber: '101',
    transactionType: 'taken',
    items: [
      { amenityId: '1', amenityName: 'Shampoo', count: 5, category: 'Bath' },
      { amenityId: '2', amenityName: 'Conditioner', count: 5, category: 'Bath' },
      { amenityId: '4', amenityName: 'Soap Bar', count: 5, category: 'Bath' },
      { amenityId: '8', amenityName: 'Water Bottle', count: 6, category: 'Beverage' }
    ]
  },
  {
    id: '2',
    staffId: 'staff1',
    staffName: 'Sarah Johnson',
    date: new Date(2025, 3, 7, 10, 45).toISOString(),
    roomId: '101',
    roomNumber: '101',
    transactionType: 'returned',
    items: [
      { amenityId: '1', amenityName: 'Shampoo', count: 1, category: 'Bath' },
      { amenityId: '2', amenityName: 'Conditioner', count: 1, category: 'Bath' }
    ]
  },
  {
    id: '3',
    staffId: 'staff2',
    staffName: 'Robert Chen',
    date: new Date(2025, 3, 6, 8, 15).toISOString(),
    roomId: '201',
    roomNumber: '201',
    transactionType: 'taken',
    items: [
      { amenityId: '1', amenityName: 'Shampoo', count: 8, category: 'Bath' },
      { amenityId: '2', amenityName: 'Conditioner', count: 8, category: 'Bath' },
      { amenityId: '3', amenityName: 'Body Lotion', count: 4, category: 'Bath' },
      { amenityId: '5', amenityName: 'Toothbrush Kit', count: 4, category: 'Personal Care' }
    ]
  },
  {
    id: '4',
    staffId: 'staff2',
    staffName: 'Robert Chen',
    date: new Date(2025, 3, 6, 12, 30).toISOString(),
    roomId: '201',
    roomNumber: '201',
    transactionType: 'returned',
    items: [
      { amenityId: '1', amenityName: 'Shampoo', count: 2, category: 'Bath' },
      { amenityId: '5', amenityName: 'Toothbrush Kit', count: 1, category: 'Personal Care' }
    ]
  },
  {
    id: '5',
    staffId: 'staff3',
    staffName: 'Maria Lopez',
    date: new Date(2025, 3, 5, 14, 20).toISOString(),
    roomId: '301',
    roomNumber: '301',
    transactionType: 'taken',
    items: [
      { amenityId: '1', amenityName: 'Shampoo', count: 4, category: 'Bath' },
      { amenityId: '2', amenityName: 'Conditioner', count: 4, category: 'Bath' },
      { amenityId: '6', amenityName: 'Slippers', count: 4, category: 'Comfort' },
      { amenityId: '7', amenityName: 'Bathrobe', count: 4, category: 'Comfort' },
      { amenityId: '9', amenityName: 'Coffee Pods', count: 6, category: 'Beverage' }
    ]
  },
  {
    id: '6',
    staffId: 'staff3',
    staffName: 'Maria Lopez',
    date: new Date(2025, 3, 5, 16, 45).toISOString(),
    roomId: '301',
    roomNumber: '301',
    transactionType: 'returned',
    items: [
      { amenityId: '7', amenityName: 'Bathrobe', count: 1, category: 'Comfort' },
      { amenityId: '9', amenityName: 'Coffee Pods', count: 2, category: 'Beverage' }
    ]
  }
];

// Get all room assistants from transactions
export const getAllRoomAssistants = (transactions: InventoryTransaction[]) => {
  const uniqueStaff = new Map();
  
  transactions.forEach(transaction => {
    uniqueStaff.set(transaction.staffId, {
      id: transaction.staffId,
      name: transaction.staffName
    });
  });
  
  return Array.from(uniqueStaff.values());
};

// Filter transactions by date range and staff
export const filterTransactions = (
  transactions: InventoryTransaction[],
  startDate: Date | null,
  endDate: Date | null,
  staffId: string | null
) => {
  return transactions.filter(transaction => {
    const transactionDate = parseISO(transaction.date);
    
    // Filter by date range
    const dateInRange = !startDate || !endDate || isWithinInterval(transactionDate, {
      start: startDate,
      end: endDate
    });
    
    // Filter by staff
    const staffMatches = !staffId || transaction.staffId === staffId;
    
    return dateInRange && staffMatches;
  });
};

// Group transactions by staff for the report
export const groupTransactionsByStaff = (transactions: InventoryTransaction[]) => {
  const groupedData = new Map();
  
  transactions.forEach(transaction => {
    const staffId = transaction.staffId;
    
    if (!groupedData.has(staffId)) {
      groupedData.set(staffId, {
        staffId,
        staffName: transaction.staffName,
        taken: [],
        returned: []
      });
    }
    
    const staffData = groupedData.get(staffId);
    
    if (transaction.transactionType === 'taken') {
      staffData.taken.push(transaction);
    } else {
      staffData.returned.push(transaction);
    }
  });
  
  return Array.from(groupedData.values());
};

// Calculate inventory summary by item
export const calculateInventorySummary = (transactions: InventoryTransaction[]) => {
  const summary = new Map();
  
  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      if (!summary.has(item.amenityId)) {
        summary.set(item.amenityId, {
          amenityId: item.amenityId,
          amenityName: item.amenityName,
          category: item.category,
          takenCount: 0,
          returnedCount: 0
        });
      }
      
      const itemSummary = summary.get(item.amenityId);
      
      if (transaction.transactionType === 'taken') {
        itemSummary.takenCount += item.count;
      } else {
        itemSummary.returnedCount += item.count;
      }
    });
  });
  
  return Array.from(summary.values());
};

// Get preset date ranges for filtering
export const getDateRangePresets = () => {
  const today = new Date();
  
  return [
    {
      label: 'Today',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      end: today
    },
    {
      label: 'Yesterday',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59)
    },
    {
      label: 'Last 7 Days',
      start: subDays(today, 6),
      end: today
    },
    {
      label: 'Last 30 Days',
      start: subDays(today, 29),
      end: today
    }
  ];
};
