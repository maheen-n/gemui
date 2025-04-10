
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoomPlanning from "./pages/RoomPlanning";
import Rooms from "./pages/Rooms";
import Guests from "./pages/Guests";
import Events from "./pages/Events";
import Staff from "./pages/Staff";
import Tasks from "./pages/Tasks";
import WorkOrders from "./pages/WorkOrders";
import LostFound from "./pages/LostFound";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Guest Management pages
import Reservations from "./pages/guest-management/Reservations";
import ReservationDetails from "./pages/guest-management/ReservationDetails";
import SpaBooking from "./pages/guest-management/SpaBooking";

// Operations pages
import AmenityManagement from "./pages/operations/AmenityManagement";
import AmenityReport from "./pages/operations/AmenityReport";
import MiniBarManagement from "./pages/operations/MiniBarManagement";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="hotel-theme">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Guest Management */}
            <Route path="/guest-management/reservations" element={<Reservations />} />
            <Route path="/guest-management/reservation-details/:id" element={<ReservationDetails />} />
            <Route path="/guest-management/spa-booking" element={<SpaBooking />} />
            
            {/* Operations */}
            <Route path="/work-orders" element={<WorkOrders />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/operations/housekeeping/amenity" element={<AmenityManagement />} />
            <Route path="/operations/housekeeping/amenity/report" element={<AmenityReport />} />
            <Route path="/operations/housekeeping/minibar" element={<MiniBarManagement />} />
            
            {/* Other routes */}
            <Route path="/room-planning" element={<RoomPlanning />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/events" element={<Events />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
