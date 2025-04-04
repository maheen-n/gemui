
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AmenityConfiguration } from '@/components/housekeeping/AmenityConfiguration';
import { AmenityTracker } from '@/components/housekeeping/AmenityTracker';
import { AmenityLogViewer } from '@/components/housekeeping/AmenityLogViewer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ClipboardList, Settings, Beer, ArrowLeft } from 'lucide-react';

const AmenityManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Amenity Management</h1>
            <p className="text-muted-foreground">Track amenity usage and manage housekeeping operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/operations/housekeeping/minibar">
                <Beer className="mr-2 h-4 w-4" />
                MiniBar Management
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/operations/housekeeping">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Housekeeping
              </Link>
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Amenity Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tracker" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-xl">
            <TabsTrigger value="tracker">Amenity Tracker</TabsTrigger>
            <TabsTrigger value="logs">Amenity Logs</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker">
            <AmenityTracker />
          </TabsContent>

          <TabsContent value="logs">
            <AmenityLogViewer />
          </TabsContent>

          <TabsContent value="configuration">
            <AmenityConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AmenityManagement;
