
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import Tasks from "./pages/Tasks";
import WorkOrders from "./pages/WorkOrders";
import LostFound from "./pages/LostFound";
import Guests from "./pages/Guests";
import Events from "./pages/Events";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/work-orders" element={<WorkOrders />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/events" element={<Events />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
