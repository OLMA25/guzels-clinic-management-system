
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Edit, Trash, FilePlus } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Sample data for demonstration
const sampleAppointments = [
  {
    id: 1,
    clientName: "سارة أحمد",
    phone: "0912345678",
    email: "sara@example.com",
    date: new Date(),
    time: "14:30",
    service: ["وجه كامل"],
    provider: "د. رشا معتوق",
    notes: "حساسية من بعض المواد",
    status: "مؤكد",
    remainingPayments: 0,
  },
  {
    id: 2,
    clientName: "رنا محمد",
    phone: "0923456789",
    email: "",
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    time: "11:00",
    service: ["ليزر كامل", "ظهر"],
    provider: "د. رشا معتوق",
    notes: "",
    status: "غير مؤكد",
    remainingPayments: 15000,
  },
  {
    id: 3,
    clientName: "نور حسن",
    phone: "0934567890",
    email: "noor@example.com",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    time: "16:15",
    service: ["فيلر شفايف"],
    provider: "د. رشا معتوق",
    notes: "أول مرة",
    status: "مؤكد",
    remainingPayments: 50000,
  },
];

// Sample service options
const serviceOptions = [
  { id: 1, label: "وجه كامل" },
  { id: 2, label: "ليزر كامل" },
  { id: 3, label: "فيلر شفايف" },
  { id: 4, label: "ظهر" },
  { id: 5, label: "ساقين" },
];

// Sample provider options
const providerOptions = [
  { id: 1, label: "د. رشا معتوق" },
  { id: 2, label: "ليلى عباس" },
];

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state for new/edit appointment
  const [formData, setFormData] = useState({
    id: 0,
    clientName: "",
    phone: "",
    email: "",
    date: new Date(),
    time: "",
    service: [] as string[],
    provider: "",
    notes: "",
    status: "غير مؤكد",
    remainingPayments: 0,
  });

  const handleAddNew = () => {
    setFormData({
      id: appointments.length + 1,
      clientName: "",
      phone: "",
      email: "",
      date: new Date(),
      time: "",
      service: [],
      provider: providerOptions[0].label,
      notes: "",
      status: "غير مؤكد",
      remainingPayments: 0,
    });
    setIsAddDialogOpen(true);
  };

  const handleEdit = (appointment: any) => {
    setFormData({ ...appointment });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      setAppointments(appointments.filter(a => a.id !== selectedAppointment.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveAppointment = () => {
    if (formData.id === 0 || !appointments.find(a => a.id === formData.id)) {
      // Add new
      setAppointments([...appointments, { ...formData, id: appointments.length + 1 }]);
    } else {
      // Update existing
      setAppointments(appointments.map(a => (a.id === formData.id ? formData : a)));
    }
    setIsAddDialogOpen(false);
  };

  const handleServiceToggle = (service: string) => {
    if (formData.service.includes(service)) {
      setFormData({
        ...formData,
        service: formData.service.filter(s => s !== service)
      });
    } else {
      setFormData({
        ...formData,
        service: [...formData.service, service]
      });
    }
  };

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appointment => 
    appointment.clientName.includes(searchQuery) || 
    appointment.phone.includes(searchQuery) ||
    (appointment.email && appointment.email.includes(searchQuery))
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة المواعيد</h1>
        <Button onClick={handleAddNew}>
          <FilePlus className="ml-2 h-4 w-4" />
          موعد جديد
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <Input
          placeholder="بحث عن زبون..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">اسم الزبون/ة</TableHead>
              <TableHead className="text-right">رقم الهاتف</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">التاريخ والوقت</TableHead>
              <TableHead className="text-right">نوع الخدمة</TableHead>
              <TableHead className="text-right">مقدم/ة الجلسة</TableHead>
              <TableHead className="text-right">ملاحظات</TableHead>
              <TableHead className="text-right">نوع الحجز</TableHead>
              <TableHead className="text-right">الدفعات المتبقية</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.id}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.phone}</TableCell>
                  <TableCell>{appointment.email || "-"}</TableCell>
                  <TableCell>
                    {format(appointment.date, "yyyy/MM/dd", { locale: ar })} {appointment.time}
                  </TableCell>
                  <TableCell>{appointment.service.join(", ")}</TableCell>
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>{appointment.notes || "-"}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{appointment.remainingPayments > 0 ? `${appointment.remainingPayments} ل.س` : "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user?.isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4 text-muted-foreground">
                  لا توجد مواعيد للعرض
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{formData.id !== 0 ? "تعديل موعد" : "إضافة موعد جديد"}</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الموعد هنا. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">اسم الزبون/ة</Label>
              <Input 
                id="clientName" 
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني (اختياري)</Label>
              <Input 
                id="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>التاريخ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {formData.date ? format(formData.date, "yyyy/MM/dd", { locale: ar }) : "اختر تاريخ"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({...formData, date})}
                    locale={ar}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">الوقت</Label>
              <Input 
                id="time" 
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">مقدم/ة الجلسة</Label>
              <Select 
                value={formData.provider}
                onValueChange={(value) => setFormData({...formData, provider: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مقدم الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((provider) => (
                    <SelectItem key={provider.id} value={provider.label}>{provider.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">نوع الحجز</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData({...formData, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="حالة الموعد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مؤكد">مؤكد</SelectItem>
                  <SelectItem value="غير مؤكد">غير مؤكد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>نوع الخدمة</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {serviceOptions.map(service => (
                  <div key={service.id} className="flex items-center space-x-2 flex-row-reverse">
                    <Checkbox 
                      id={`service-${service.id}`} 
                      checked={formData.service.includes(service.label)}
                      onCheckedChange={() => handleServiceToggle(service.label)}
                    />
                    <Label htmlFor={`service-${service.id}`}>{service.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remainingPayments">الدفعات المتبقية (ل.س)</Label>
              <Input 
                id="remainingPayments" 
                type="number"
                value={formData.remainingPayments}
                onChange={(e) => setFormData({...formData, remainingPayments: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">ملاحظات (اختياري)</Label>
              <Textarea 
                id="notes" 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveAppointment}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الموعد؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
            <Button variant="destructive" onClick={confirmDelete}>حذف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
