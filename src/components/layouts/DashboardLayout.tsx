
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import TopNavbar from "@/components/navigation/TopNavbar";
import LeftSidebar from "@/components/navigation/LeftSidebar";
import RightSidebar from "@/components/navigation/RightSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Left sidebar with calendar and financials */}
          <LeftSidebar />
          
          {/* Main content area */}
          <SidebarInset className="flex flex-col flex-1">
            {/* Top navbar with search, theme toggle, etc. */}
            <TopNavbar />
            
            {/* Main content */}
            <main className="flex-1 p-4 overflow-auto">
              {children}
            </main>
          </SidebarInset>
          
          {/* Right sidebar with action buttons */}
          <RightSidebar />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
