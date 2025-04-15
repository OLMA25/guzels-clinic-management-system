
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
  Edit,
  Plus,
  Search,
  Trash2,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Sample data for demonstration
const initialClients = [
  {
    id: 1,
    name: "سارة أحمد",
    phone: "0956789123",
    email: "sara@example.com",
    hairType: "ناعم",
    hairColor: "أسود",
    skinType: "جافة",
    allergies: "نعم - لاتكس",
    currentSessions: 3,
    remainingSessions: 2,
    mostRequestedServices: "وجه كامل، ليزر ساقين",
    remainingPayments: 0,
    notes: "تفضل موعد بعد الظهر",
  },
  {
    id: 2,
    name: "رنا محمد",
    phone: "0932123456",
    email: "",
    hairType: "خشن",
    hairColor: "بني",
    skinType: "دهنية",
    allergies: "لا",
    currentSessions: 5,
    remainingSessions: 0,
    mostRequestedServices: "ليزر كامل",
    remainingPayments: 25000,
    notes: "",
  },
  {
    id: 3,
    name: "نور حسن",
    phone: "0945678901",
    email: "noor@example.com",
    hairType: "متوسط",
    hairColor: "أشقر",
    skinType: "مختلطة",
    allergies: "لا",
    currentSessions: 1,
    remainingSessions: 4,
    mostRequestedServices: "فيلر شفايف",
    remainingPayments: 0,
    notes: "تفضل الموظفة مريم",
  },
];

const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.includes(searchQuery) ||
      client.phone.includes(searchQuery) ||
      client.mostRequestedServices.includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">الزبائن</h1>
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
            <Plus size={16} /> زبون جديد
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">رقم الهاتف</TableHead>
              <TableHead className="text-right">نوع البشرة</TableHead>
              <TableHead className="text-right">حساسية</TableHead>
              <TableHead className="text-right">الجلسات الحالية</TableHead>
              <TableHead className="text-right">الجلسات المتبقية</TableHead>
              <TableHead className="text-right">الخدمات الأكثر طلباً</TableHead>
              <TableHead className="text-right">الدفعات المتبقية</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.id}</TableCell>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.skinType}</TableCell>
                  <TableCell>{client.allergies}</TableCell>
                  <TableCell className="text-center">{client.currentSessions}</TableCell>
                  <TableCell className="text-center">{client.remainingSessions}</TableCell>
                  <TableCell>{client.mostRequestedServices}</TableCell>
                  <TableCell>
                    {client.remainingPayments > 0
                      ? `${client.remainingPayments.toLocaleString()} ل.س`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="ملف الزبون"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      {user?.isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium">لا يوجد زبائن</h3>
                    <p className="text-muted-foreground text-sm">
                      قم بإضافة زبائن جدد باستخدام زر "زبون جديد"
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

export default Clients;
