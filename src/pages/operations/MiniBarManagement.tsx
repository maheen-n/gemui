
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MiniBarConfiguration } from '@/components/minibar/MiniBarConfiguration';
import { MiniBarTracker } from '@/components/minibar/MiniBarTracker';
import { MiniBarLogViewer } from '@/components/minibar/MiniBarLogViewer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Beer, Settings, ArrowLeft } from 'lucide-react';

const MiniBarManagement = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">MiniBar Management</h1>
            <p className="text-muted-foreground">Track minibar usage and manage inventory</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/operations/housekeeping">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Housekeeping
              </Link>
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              MiniBar Settings
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tracker" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-xl">
            <TabsTrigger value="tracker">MiniBar Tracker</TabsTrigger>
            <TabsTrigger value="logs">Usage Logs</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="tracker">
            <MiniBarTracker />
          </TabsContent>

          <TabsContent value="logs">
            <MiniBarLogViewer />
          </TabsContent>

          <TabsContent value="configuration">
            <MiniBarConfiguration />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MiniBarManagement;
