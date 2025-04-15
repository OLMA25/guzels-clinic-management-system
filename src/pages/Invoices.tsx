
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit, Trash, Printer, FilePlus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Sample data for demonstration
const sampleInvoices = [
  {
    id: 1,
    clientName: "سارة أحمد",
    phone: "0912345678",
    date: new Date(),
    time: "14:30",
    services: ["وجه كامل"],
    paymentType: "كاش",
    amountPaid: 50000,
    remainingAmount: 0,
    totalAmount: 50000,
    invoiceCreator: "admin",
    serviceProvider: "د. رشا معتوق",
  },
  {
    id: 2,
    clientName: "رنا محمد",
    phone: "0923456789",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    time: "11:00",
    services: ["ليزر كامل", "ظهر"],
    paymentType: "تقسيط",
    amountPaid: 300000,
    remainingAmount: 150000,
    totalAmount: 450000,
    invoiceCreator: "user1",
    serviceProvider: "د. رشا معتوق",
  },
  {
    id: 3,
    clientName: "نور حسن",
    phone: "0934567890",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // One week ago
    time: "16:15",
    services: ["فيلر شفايف"],
    paymentType: "تقسيط",
    amountPaid: 250000,
    remainingAmount: 100000,
    totalAmount: 350000,
    invoiceCreator: "admin",
    serviceProvider: "د. رشا معتوق",
  },
];

// Sample service options for invoice creation
const serviceOptions = [
  { id: 1, name: "وجه كامل", price: 50000 },
  { id: 2, name: "ليزر كامل", price: 700000 },
  { id: 3, name: "فيلر شفايف", price: 350000 },
  { id: 4, name: "ظهر", price: 130000 },
  { id: 5, name: "ساقين", price: 120000 },
];

// Sample provider options
const providerOptions = [
  { id: 1, name: "د. رشا معتوق" },
  { id: 2, name: "ليلى عباس" },
];

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state for new/edit invoice
  const [formData, setFormData] = useState({
    id: 0,
    clientName: "",
    phone: "",
    date: new Date(),
    time: "",
    services: [] as string[],
    paymentType: "كاش",
    amountPaid: 0,
    remainingAmount: 0,
    totalAmount: 0,
    invoiceCreator: user?.username || "",
    serviceProvider: "",
  });

  const [selectedServices, setSelectedServices] = useState<Array<{id: number; name: string; price: number}>>([]);

  // Calculate the total amount whenever selected services change
  React.useEffect(() => {
    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      amountPaid: prev.paymentType === "كاش" ? total : prev.amountPaid,
      remainingAmount: prev.paymentType === "كاش" ? 0 : total - prev.amountPaid
    }));
  }, [selectedServices]);

  // Update remaining amount when payment type or amount paid changes
  React.useEffect(() => {
    if (formData.paymentType === "كاش") {
      setFormData(prev => ({
        ...prev,
        amountPaid: prev.totalAmount,
        remainingAmount: 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        remainingAmount: prev.totalAmount - prev.amountPaid
      }));
    }
  }, [formData.paymentType, formData.amountPaid]);

  const handleAddNew = () => {
    setSelectedServices([]);
    setFormData({
      id: 0,
      clientName: "",
      phone: "",
      date: new Date(),
      time: "",
      services: [],
      paymentType: "كاش",
      amountPaid: 0,
      remainingAmount: 0,
      totalAmount: 0,
      invoiceCreator: user?.username || "",
      serviceProvider: providerOptions[0].name,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (invoice: any) => {
    const servicesDetails = invoice.services.map(
      (serviceName: string) => serviceOptions.find(s => s.name === serviceName) || 
      { id: 0, name: serviceName, price: 0 }
    );
    
    setSelectedServices(servicesDetails);
    setFormData({ ...invoice });
    setIsFormOpen(true);
  };

  const handleDelete = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  const handlePrint = (invoice: any) => {
    console.log("Printing invoice:", invoice.id);
    // Implement print functionality
    window.alert(`جاري طباعة الفاتورة رقم ${invoice.id} للزبون ${invoice.clientName}`);
  };

  const confirmDelete = () => {
    if (selectedInvoice) {
      setInvoices(invoices.filter(i => i.id !== selectedInvoice.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveInvoice = () => {
    const servicesNames = selectedServices.map(s => s.name);
    
    const updatedFormData = {
      ...formData,
      services: servicesNames
    };
    
    if (formData.id === 0) {
      // Add new
      setInvoices([...invoices, { ...updatedFormData, id: invoices.length + 1 }]);
    } else {
      // Update existing
      setInvoices(invoices.map(i => (i.id === formData.id ? updatedFormData : i)));
    }
    setIsFormOpen(false);
  };

  const handleServiceToggle = (service: {id: number; name: string; price: number}) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => 
    invoice.clientName.includes(searchQuery) || 
    invoice.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الفواتير</h1>
        <Button onClick={handleAddNew}>
          <FilePlus className="ml-2 h-4 w-4" />
          فاتورة جديدة
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <Input
          placeholder="بحث عن فاتورة..."
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
              <TableHead className="text-right">التاريخ والوقت</TableHead>
              <TableHead className="text-right">الخدمات</TableHead>
              <TableHead className="text-right">نوع الدفع</TableHead>
              <TableHead className="text-right">المبلغ المدفوع</TableHead>
              <TableHead className="text-right">المبلغ المتبقي</TableHead>
              <TableHead className="text-right">محرر الفاتورة</TableHead>
              <TableHead className="text-right">مقدم الخدمة</TableHead>
              <TableHead className="text-right">المبلغ الكلي</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>{invoice.phone}</TableCell>
                  <TableCell>
                    {format(invoice.date, "yyyy/MM/dd", { locale: ar })} {invoice.time}
                  </TableCell>
                  <TableCell>{invoice.services.join(", ")}</TableCell>
                  <TableCell>{invoice.paymentType}</TableCell>
                  <TableCell>{invoice.amountPaid} ل.س</TableCell>
                  <TableCell>{invoice.remainingAmount > 0 ? `${invoice.remainingAmount} ل.س` : "-"}</TableCell>
                  <TableCell>{invoice.invoiceCreator}</TableCell>
                  <TableCell>{invoice.serviceProvider}</TableCell>
                  <TableCell>{invoice.totalAmount} ل.س</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handlePrint(invoice)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      {user?.isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(invoice)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {user?.isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-4 text-muted-foreground">
                  لا توجد فواتير للعرض
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{formData.id !== 0 ? "تعديل فاتورة" : "إنشاء فاتورة جديدة"}</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الفاتورة هنا. اضغط حفظ عند الانتهاء.
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
              <Label htmlFor="serviceProvider">مقدم/ة الخدمة</Label>
              <Select 
                value={formData.serviceProvider}
                onValueChange={(value) => setFormData({...formData, serviceProvider: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مقدم الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  {providerOptions.map((provider) => (
                    <SelectItem key={provider.id} value={provider.name}>{provider.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentType">نوع الدفع</Label>
              <Select 
                value={formData.paymentType}
                onValueChange={(value) => setFormData({...formData, paymentType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="كاش">كاش</SelectItem>
                  <SelectItem value="تقسيط">تقسيط</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>الخدمات</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 border rounded-md p-2">
                {serviceOptions.map(service => (
                  <div key={service.id} className="flex items-center space-x-2 flex-row-reverse">
                    <Checkbox 
                      id={`service-${service.id}`} 
                      checked={selectedServices.some(s => s.id === service.id)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <Label htmlFor={`service-${service.id}`}>
                      {service.name} - {service.price} ل.س
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalAmount">المبلغ الكلي (ل.س)</Label>
              <Input 
                id="totalAmount" 
                type="number"
                value={formData.totalAmount}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amountPaid">المبلغ المدفوع (ل.س)</Label>
              <Input 
                id="amountPaid" 
                type="number"
                value={formData.amountPaid}
                onChange={(e) => setFormData({...formData, amountPaid: Number(e.target.value)})}
                readOnly={formData.paymentType === "كاش"}
                className={formData.paymentType === "كاش" ? "bg-muted" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remainingAmount">المبلغ المتبقي (ل.س)</Label>
              <Input 
                id="remainingAmount" 
                type="number"
                value={formData.remainingAmount}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveInvoice}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه الفاتورة؟
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

export default Invoices;
