import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { AmenityConfiguration } from '@/components/housekeeping/AmenityConfiguration';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';

const AmenityManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Amenity Management</h1>
            <p className="text-muted-foreground">Configure and manage housekeeping amenities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/operations/housekeeping/amenity/report">
                <BarChart3 className="mr-2 h-4 w-4" />
                Inventory Reports
              </Link>
            </Button>
          </div>
        </div>

        <AmenityConfiguration />
      </div>
    </DashboardLayout>
  );
};

export default AmenityManagement;
