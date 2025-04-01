
import React, { useState } from 'react';
import { SpaService, SpaServiceDuration } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface SpaServicesListProps {
  services: SpaService[];
  selectedService: SpaService | null;
  selectedDuration: SpaServiceDuration | null;
  genderFilter: 'all' | 'male' | 'female' | 'couples';
  onServiceSelect: (service: SpaService) => void;
  onDurationSelect: (duration: SpaServiceDuration) => void;
  onGenderFilterChange: (gender: 'all' | 'male' | 'female' | 'couples') => void;
}

const SpaServicesList: React.FC<SpaServicesListProps> = ({
  services,
  selectedService,
  selectedDuration,
  genderFilter,
  onServiceSelect,
  onDurationSelect,
  onGenderFilterChange
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Get unique categories from services
  const categories = ['all', ...Array.from(new Set(services.map(service => service.category)))];
  
  // Filter services based on gender and category
  const filteredServices = services.filter(service => {
    const genderMatch = 
      genderFilter === 'all' || 
      service.genderCriteria === 'all' || 
      service.genderCriteria === genderFilter;
      
    const categoryMatch = 
      activeCategory === 'all' || 
      service.category === activeCategory;
      
    return genderMatch && categoryMatch;
  });
  
  // Handle duration selection
  const handleDurationChange = (durationId: string) => {
    if (selectedService) {
      const duration = selectedService.durations.find(d => d.id === durationId);
      if (duration) {
        onDurationSelect(duration);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Gender Filter */}
      <div>
        <Label className="text-sm font-medium mb-1.5 block">Guest Type</Label>
        <RadioGroup 
          defaultValue="all" 
          value={genderFilter}
          onValueChange={(value) => onGenderFilterChange(value as 'all' | 'male' | 'female' | 'couples')}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male" className="cursor-pointer">Male</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female" className="cursor-pointer">Female</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="couples" id="couples" />
            <Label htmlFor="couples" className="cursor-pointer">Couples</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Separator />
      
      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Massages">Massages</TabsTrigger>
          <TabsTrigger value="Facials">Facials</TabsTrigger>
        </TabsList>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="Body Treatments">Body</TabsTrigger>
          <TabsTrigger value="Couple Treatments">Couples</TabsTrigger>
          <TabsTrigger value="Men's Treatments">Men's</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Service List */}
      <div className="mt-4">
        <Label className="text-sm font-medium mb-2 block">Select Service</Label>
        <ScrollArea className="h-[320px] pr-4">
          {filteredServices.length > 0 ? (
            <div className="space-y-2">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className={cn(
                    "border rounded-md p-3 cursor-pointer transition-colors",
                    selectedService?.id === service.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-gray-400"
                  )}
                  onClick={() => onServiceSelect(service)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {service.description}
                      </div>
                    </div>
                    <Badge variant={service.genderCriteria === 'all' ? "outline" : "secondary"}>
                      {service.genderCriteria === 'all' ? 'All' : 
                       service.genderCriteria === 'male' ? 'Men' : 
                       service.genderCriteria === 'female' ? 'Women' : 'Couples'}
                    </Badge>
                  </div>

                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{service.durations.map(d => `${d.minutes} min`).join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No services found for the selected filters.
            </div>
          )}
        </ScrollArea>
      </div>
      
      {/* Duration Selection */}
      {selectedService && (
        <div className="mt-4">
          <Label className="text-sm font-medium mb-2 block">Select Duration</Label>
          <RadioGroup 
            value={selectedDuration?.id} 
            onValueChange={handleDurationChange}
            className="grid grid-cols-2 gap-2"
          >
            {selectedService.durations.map((duration) => (
              <div
                key={duration.id}
                className={cn(
                  "border rounded-md p-3 cursor-pointer transition-colors flex items-center",
                  selectedDuration?.id === duration.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-gray-400"
                )}
              >
                <RadioGroupItem value={duration.id} id={duration.id} className="mr-2" />
                <div className="flex-grow">
                  <Label htmlFor={duration.id} className="cursor-pointer font-medium">
                    {duration.minutes} mins
                  </Label>
                  <div className="text-sm text-muted-foreground">${duration.price}</div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default SpaServicesList;
