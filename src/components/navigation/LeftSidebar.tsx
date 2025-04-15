
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { ar } from "date-fns/locale";
import { addDays } from "date-fns";

// Sample appointment data for demo
const sampleAppointments = [
  { id: 1, date: addDays(new Date(), 1), clientName: "سارة أحمد", service: "وجه كامل" },
  { id: 2, date: addDays(new Date(), 2), clientName: "رنا محمد", service: "إزالة الشعر بالليزر" },
  { id: 3, date: addDays(new Date(), 3), clientName: "نور حسن", service: "فيلر شفايف" },
  { id: 4, date: new Date(), clientName: "ليلى خالد", service: "ليزر كامل" },
];

const LeftSidebar: React.FC = () => {
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);

  // Filter appointments for the selected date
  const selectedDateAppointments = sampleAppointments.filter(app => 
    date && app.date.toDateString() === date.toDateString()
  );

  // Check for days with appointments
  const isDayWithAppointment = (date: Date) => {
    return sampleAppointments.some(
      app => app.date.toDateString() === date.toDateString()
    );
  };

  return (
    <Sidebar side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>التقويم</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-1">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ar}
                className="rtl:text-right"
                modifiers={{ 
                  hasAppointment: (date) => isDayWithAppointment(date)
                }}
                modifiersClassNames={{
                  hasAppointment: "font-bold relative before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-1 before:h-1 before:bg-primary before:rounded-full"
                }}
              />
              
              <div className="mt-4">
                <h3 className="font-medium text-sm mb-2">
                  {date ? `مواعيد ${date.toLocaleDateString('ar-EG')}` : 'المواعيد'}
                </h3>
                {selectedDateAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateAppointments.map(app => (
                      <div 
                        key={app.id} 
                        className="p-2 bg-secondary/50 text-xs rounded-md"
                      >
                        <p className="font-bold">{app.clientName}</p>
                        <p>{app.service}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">لا توجد مواعيد لهذا اليوم</p>
                )}
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Only show financial summary for admin users */}
        {user?.isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>الإحصائيات المالية</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">الرصيد اليومي</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-xl font-bold">850,000 ل.س</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">الرصيد الأسبوعي</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-xl font-bold">3,250,000 ل.س</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">الرصيد الشهري</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-xl font-bold">12,500,000 ل.س</p>
                  </CardContent>
                </Card>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default LeftSidebar;
