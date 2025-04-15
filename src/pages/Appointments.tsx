
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Edit,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Sample data for demonstration
const initialAppointments = [
  {
    id: 1,
    client: "سارة أحمد",
    phone: "0956789123",
    email: "sara@example.com",
    date: "2025-04-15",
    time: "14:30",
    service: "وجه كامل",
    provider: "د. رشا معتوق",
    notes: "حساسية من مستحضرات معينة",
    status: "مثبت",
    remainingPayments: 0,
  },
  {
    id: 2,
    client: "رنا محمد",
    phone: "0932123456",
    email: "",
    date: "2025-04-16",
    time: "11:00",
    service: "ليزر كامل",
    provider: "مريم خليل",
    notes: "",
    status: "مثبت",
    remainingPayments: 25000,
  },
  {
    id: 3,
    client: "نور حسن",
    phone: "0945678901",
    email: "noor@example.com",
    date: "2025-04-17",
    time: "16:15",
    service: "فيلر شفايف",
    provider: "د. رشا معتوق",
    notes: "أول مرة تأتي للعيادة",
    status: "غير مثبت",
    remainingPayments: 0,
  },
];

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.client.includes(searchQuery) ||
      appointment.phone.includes(searchQuery) ||
      appointment.service.includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">المواعيد</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Button className="gap-1 whitespace-nowrap">
            <Plus size={16} /> موعد جديد
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">الزبون/ة</TableHead>
              <TableHead className="text-right">رقم الهاتف</TableHead>
              <TableHead className="text-right">التاريخ والوقت</TableHead>
              <TableHead className="text-right">الخدمة</TableHead>
              <TableHead className="text-right">مقدم الخدمة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الدفعات المتبقية</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell className="font-medium">{appointment.client}</TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{appointment.date}</span>
                      <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === "مثبت"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {appointment.remainingPayments > 0
                      ? `${appointment.remainingPayments.toLocaleString()} ل.س`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user?.isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium">لا توجد مواعيد</h3>
                    <p className="text-muted-foreground text-sm">
                      قم بإضافة مواعيد جديدة باستخدام زر "موعد جديد"
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Appointments;
