
import React, { useState } from 'react';
import { format, parseISO, addMinutes } from 'date-fns';
import { SpaService, SpaServiceDuration } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface SpaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: SpaService;
  duration: SpaServiceDuration;
  selectedDate: Date;
  selectedTimeSlot: string;
  onSubmit: (bookingData: any) => void;
}

const SpaBookingModal: React.FC<SpaBookingModalProps> = ({
  isOpen,
  onClose,
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
  const [therapist, setTherapist] = useState('');
  
  // Mock therapists
  const mockTherapists = [
    { id: 'therapist-1', name: 'John Doe' },
    { id: 'therapist-2', name: 'Jane Smith' },
    { id: 'therapist-3', name: 'David Johnson' },
    { id: 'therapist-4', name: 'Sarah Williams' },
    { id: 'therapist-5', name: 'Robert Chen' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guestName) {
      toast({
        variant: "destructive",
        title: "Guest name required",
        description: "Please enter the guest name for the booking.",
      });
      return;
    }
    
    const bookingData = {
      serviceId: service.id,
      serviceName: service.name,
      durationId: duration.id,
      durationMinutes: duration.minutes,
      price: duration.price,
      selectedDate,
      startTime: selectedTimeSlot,
      endTime: format(addMinutes(parseISO(selectedTimeSlot), duration.minutes), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      guestName,
      guestEmail,
      specialRequests,
      roomNumber,
      therapistId: therapist,
      therapistName: mockTherapists.find(t => t.id === therapist)?.name || '',
    };
    
    onSubmit(bookingData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book {service.name}</DialogTitle>
          <DialogDescription>
            Fill in the details to complete the booking
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex flex-col space-y-2 rounded-md border p-3 bg-muted/50">
            <div className="flex justify-between items-center">
              <div className="font-medium">{service.name}</div>
              <Badge>{service.category}</Badge>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground space-x-4">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{duration.minutes} minutes</span>
              </div>
              <div>${duration.price}</div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{format(selectedDate, 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>
                  {format(parseISO(selectedTimeSlot), 'h:mm a')} - {
                    format(addMinutes(parseISO(selectedTimeSlot), duration.minutes), 'h:mm a')
                  }
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="guestName">Guest Name *</Label>
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
            <Label htmlFor="therapist">Preferred Therapist</Label>
            <Select
              value={therapist}
              onValueChange={setTherapist}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a therapist" />
              </SelectTrigger>
              <SelectContent>
                {mockTherapists.map((therapist) => (
                  <SelectItem key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm Booking
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpaBookingModal;
