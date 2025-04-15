
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Menu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TopNavbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-card shadow-sm border-b border-border p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="ml-2" />
        
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            placeholder="بحث..."
            className="w-[200px] md:w-[300px] h-9 bg-secondary/80 border-input focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            size="icon"
            variant="ghost"
            type="submit"
            className="absolute left-0.5 top-0 h-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="text-center py-2 text-muted-foreground">
              لا توجد إشعارات حالياً
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>الإعدادات</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>الملف الشخصي</DropdownMenuItem>
            {user?.isAdmin && (
              <>
                <DropdownMenuItem>إدارة المستخدمين</DropdownMenuItem>
                <DropdownMenuItem>نسخ احتياطي</DropdownMenuItem>
                <DropdownMenuItem>إدارة رسائل الواتس آب</DropdownMenuItem>
                <DropdownMenuItem>التقارير المالية</DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem>حول البرنامج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="icon" variant="ghost" onClick={logout}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default TopNavbar;
