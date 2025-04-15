
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Clients from "./pages/Clients";
import Services from "./pages/Services";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { initializeDatabase } from "@/lib/db";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  // تهيئة قاعدة البيانات عند بدء التطبيق
  useEffect(() => {
    const initDB = async () => {
      try {
        await initializeDatabase();
        console.log("تم تهيئة قاعدة البيانات بنجاح");
      } catch (error) {
        console.error("خطأ في تهيئة قاعدة البيانات:", error);
        toast.error("حدث خطأ أثناء تهيئة قاعدة البيانات");
      }
    };
    
    initDB();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Root path redirects based on authentication */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected dashboard routes */}
                <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
                <Route path="/appointments" element={<DashboardLayout><Appointments /></DashboardLayout>} />
                <Route path="/clients" element={<DashboardLayout><Clients /></DashboardLayout>} />
                <Route path="/services" element={<DashboardLayout><Services /></DashboardLayout>} />
                <Route path="/invoices" element={<DashboardLayout><Invoices /></DashboardLayout>} />
                <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
                
                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
