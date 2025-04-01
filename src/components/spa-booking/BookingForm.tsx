
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { SpaService, SpaServiceDuration } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, Clock, User, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface BookingFormProps {
  service: SpaService;
  duration: SpaServiceDuration;
  selectedDate: Date;
  selectedTimeSlot: string | null;
  onSubmit: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  service,
  duration,
  selectedDate,
  selectedTimeSlot,
  onSubmit
}) => {
  const { toast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTimeSlot) {
      toast({
        variant: "destructive",
        title: "Time slot required",
        description: "Please select a time slot for the booking.",
      });
      return;
    }
    
    if (!guestName) {
      toast({
        variant: "destructive",
        title: "Guest name required",
        description: "Please enter the guest name for the booking.",
      });
      return;
    }
    
    // Submit the booking
    console.log({
      service,
      duration,
      selectedDate,
      selectedTimeSlot,
      guestName,
      guestEmail,
      specialRequests,
      roomNumber
    });
    
    toast({
      title: "Booking successful!",
      description: `${service.name} booked for ${guestName} on ${format(selectedDate, 'MMMM d, yyyy')} at ${selectedTimeSlot ? format(parseISO(selectedTimeSlot), 'h:mm a') : ''}`,
    });
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="guestName">Guest Name</Label>
        <Input
          id="guestName"
          placeholder="Enter guest name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="guestEmail">Guest Email</Label>
        <Input
          id="guestEmail"
          type="email"
          placeholder="Enter guest email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="roomNumber">Room Number (if staying at hotel)</Label>
        <Input
          id="roomNumber"
          placeholder="Enter room number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          placeholder="Any special requests or notes"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          className="min-h-[80px]"
        />
      </div>
      
      <div className="space-y-2 rounded-md border p-3">
        <div className="font-medium">Booking Summary</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span>{duration.minutes} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span>${duration.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{format(selectedDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span>
              {selectedTimeSlot 
                ? format(parseISO(selectedTimeSlot), 'h:mm a') 
                : 'Not selected'}
            </span>
          </div>
        </div>
      </div>
      
      {!selectedTimeSlot && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a time slot to complete booking.
          </AlertDescription>
        </Alert>
      )}
      
      <Button type="submit" className="w-full" disabled={!selectedTimeSlot}>
        Confirm Booking
      </Button>
    </form>
  );
};

export default BookingForm;
