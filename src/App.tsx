
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ElectionProvider } from "@/context/ElectionContext";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";

import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import VoterLogin from "./pages/VoterLogin";
import AdminDashboard from "./pages/AdminDashboard";
import VoterDashboard from "./pages/VoterDashboard";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ElectionProvider>
      <TooltipProvider>
        <SidebarProvider>
          <BrowserRouter>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/voter-login" element={<VoterLogin />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/voter-dashboard" element={<VoterDashboard />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </SidebarProvider>
      </TooltipProvider>
    </ElectionProvider>
  </QueryClientProvider>
);

export default App;
