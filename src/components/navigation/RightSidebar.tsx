
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clipboard, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RightSidebar: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, label: "المواعيد", icon: Calendar, path: "/appointments" },
    { id: 2, label: "الزبائن", icon: Users, path: "/clients" },
    { id: 3, label: "الخدمات والأسعار", icon: Clipboard, path: "/services" },
    { id: 4, label: "الفواتير", icon: FileText, path: "/invoices" },
  ];

  return (
    <Sidebar side="left">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-3 p-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2 bg-secondary/50 hover:bg-primary/20 border-primary/30 transition-all"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-8 w-8 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Button>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default RightSidebar;
