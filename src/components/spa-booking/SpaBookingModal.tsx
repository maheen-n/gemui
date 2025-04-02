
import React, { useState } from 'react';
import { format, parseISO, addMinutes, set } from 'date-fns';
import { SpaService, SpaServiceDuration } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SpaBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: SpaService | null;
  duration: SpaServiceDuration | null;
  selectedDate: Date;
  selectedTimeSlot: string | null;
  onSubmit: (bookingData: any) => void;
  isCustomBooking?: boolean;
  services?: SpaService[];
}

const SpaBookingModal: React.FC<SpaBookingModalProps> = ({
  isOpen,
  onClose,
  service: initialService,
  duration: initialDuration,
  selectedDate,
  selectedTimeSlot,
  onSubmit,
  isCustomBooking = false,
  services = []
}) => {
  const { toast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [therapist, setTherapist] = useState('');
  const [customTime, setCustomTime] = useState('09:00');
  const [selectedService, setSelectedService] = useState<SpaService | null>(initialService);
  const [selectedDuration, setSelectedDuration] = useState<SpaServiceDuration | null>(initialDuration);
  
  // Mock therapists
  const mockTherapists = [
    { id: 'therapist-1', name: 'John Doe' },
    { id: 'therapist-2', name: 'Jane Smith' },
    { id: 'therapist-3', name: 'David Johnson' },
    { id: 'therapist-4', name: 'Sarah Williams' },
    { id: 'therapist-5', name: 'Robert Chen' },
  ];

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    setSelectedService(service || null);
    setSelectedDuration(service?.durations[0] || null);
  };

  const handleDurationChange = (durationId: string) => {
    const duration = selectedService?.durations.find(d => d.id === durationId);
    setSelectedDuration(duration || null);
  };
  
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

    if (!selectedService || !selectedDuration) {
      toast({
        variant: "destructive",
        title: "Service selection required",
        description: "Please select a service and duration for the booking.",
      });
      return;
    }
    
    let bookingTime = selectedTimeSlot;
    if (isCustomBooking && customTime) {
      const [hours, minutes] = customTime.split(':').map(Number);
      const customDate = set(selectedDate, { hours, minutes });
      bookingTime = customDate.toISOString();
    }
    
    const bookingData = {
      guestName,
      guestEmail,
      specialRequests,
      roomNumber,
      therapistId: therapist,
      therapistName: mockTherapists.find(t => t.id === therapist)?.name || '',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      durationId: selectedDuration.id,
      durationMinutes: selectedDuration.minutes,
      price: selectedDuration.price,
      startTime: bookingTime,
      selectedDate
    };
    
    onSubmit(bookingData);
    
    setGuestName('');
    setGuestEmail('');
    setSpecialRequests('');
    setRoomNumber('');
    setTherapist('');
    setCustomTime('09:00');
    setSelectedService(null);
    setSelectedDuration(null);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>
            {isCustomBooking ? 'Create Custom Booking' : 'Book Spa Service'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details to complete the booking
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="pr-4 max-h-[60vh]">
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Select
                  value={selectedService?.id || ''}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedService && (
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select
                    value={selectedDuration?.id || ''}
                    onValueChange={handleDurationChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedService.durations.map((duration) => (
                        <SelectItem key={duration.id} value={duration.id}>
                          {duration.minutes} minutes - ${duration.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {selectedService && selectedDuration && (
              <div className="flex flex-col space-y-2 rounded-md border p-3 bg-muted/50">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{selectedService.name}</div>
                  <Badge>{selectedService.category}</Badge>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{selectedDuration.minutes} minutes</span>
                  </div>
                  <div>${selectedDuration.price}</div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{format(selectedDate, 'MMM d, yyyy')}</span>
                  </div>
                  {isCustomBooking ? (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{customTime}</span>
                    </div>
                  ) : selectedTimeSlot ? (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{format(parseISO(selectedTimeSlot), 'h:mm a')}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            
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
            
            {isCustomBooking && (
              <div className="space-y-2">
                <Label htmlFor="customTime">Time *</Label>
                <Input
                  id="customTime"
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  min="09:00"
                  max="19:00"
                  required
                />
              </div>
            )}
          </form>
        </ScrollArea>
        
        <DialogFooter className="mt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpaBookingModal;
