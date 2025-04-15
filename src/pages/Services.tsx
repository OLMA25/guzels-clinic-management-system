
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash, Clipboard } from "lucide-react";

// Import the service data as provided by the user
const initialServices = [
  { id: 1, name: "وجه كامل", price: 50000, pricingType: "fixed" },
  { id: 2, name: "شارب", price: 1500, pricingType: "dynamic" },
  { id: 3, name: "ذقن", price: 1500, pricingType: "dynamic" },
  { id: 4, name: "كف اليد", price: 1500, pricingType: "dynamic" },
  { id: 5, name: "ايدين كاملين", price: 150000, pricingType: "fixed" },
  { id: 6, name: "ساعدين", price: 80000, pricingType: "fixed" },
  { id: 7, name: "عضدين", price: 90000, pricingType: "fixed" },
  { id: 8, name: "رجلين كاملين", price: 250000, pricingType: "fixed" },
  { id: 9, name: "ساقين", price: 120000, pricingType: "fixed" },
  { id: 10, name: "فخذين", price: 150000, pricingType: "fixed" },
  { id: 11, name: "ارداف", price: 50000, pricingType: "fixed" },
  { id: 12, name: "بيكيني", price: 50000, pricingType: "fixed" },
  { id: 13, name: "ابط", price: 50000, pricingType: "fixed" },
  { id: 14, name: "ابط + بيكيني", price: 100000, pricingType: "fixed" },
  { id: 15, name: "بطن", price: 120000, pricingType: "fixed" },
  { id: 16, name: "خط السرة", price: 80000, pricingType: "fixed" },
  { id: 17, name: "اسفل الظهر", price: 1500, pricingType: "dynamic" },
  { id: 18, name: "ظهر", price: 130000, pricingType: "fixed" },
  { id: 19, name: "جسم كامل", price: 700000, pricingType: "fixed" },
  { id: 20, name: "جسم كامل مع وجه وارداف", price: 750000, pricingType: "fixed" },
  { id: 21, name: "جسم جزئي", price: 550000, pricingType: "fixed" },
];

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState(initialServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state for new/edit service
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    price: 0,
    pricingType: "fixed" as "fixed" | "dynamic", // Either fixed price or dynamic (per laser shot)
  });

  const handleAddNew = () => {
    setFormData({
      id: 0,
      name: "",
      price: 0,
      pricingType: "fixed",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (service: any) => {
    setFormData({ ...service });
    setIsFormOpen(true);
  };

  const handleDelete = (service: any) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      setServices(services.filter(s => s.id !== selectedService.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveService = () => {
    if (formData.id === 0) {
      // Add new
      setServices([...services, { ...formData, id: services.length + 1 }]);
    } else {
      // Update existing
      setServices(services.map(s => (s.id === formData.id ? formData : s)));
    }
    setIsFormOpen(false);
  };

  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.name.includes(searchQuery)
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الخدمات والأسعار</h1>
        <Button onClick={handleAddNew}>
          <Clipboard className="ml-2 h-4 w-4" />
          خدمة جديدة
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <Input
          placeholder="بحث عن خدمة..."
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
              <TableHead className="text-right">اسم الخدمة</TableHead>
              <TableHead className="text-right">السعر (ل.س)</TableHead>
              <TableHead className="text-right">نوع التسعير</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.id}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>
                    {service.pricingType === "fixed" 
                      ? `${service.price} ل.س` 
                      : `${service.price} ل.س لكل ضربة ليزر`}
                  </TableCell>
                  <TableCell>
                    {service.pricingType === "fixed" 
                      ? "سعر ثابت" 
                      : "ديناميكي - حسب عدد ضربات الليزر"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user?.isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {user?.isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(service)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  لا توجد خدمات للعرض
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{formData.id !== 0 ? "تعديل خدمة" : "إضافة خدمة جديدة"}</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الخدمة هنا. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">اسم الخدمة</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricingType">نوع التسعير</Label>
              <Select 
                value={formData.pricingType}
                onValueChange={(value: "fixed" | "dynamic") => setFormData({...formData, pricingType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع التسعير" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">سعر ثابت</SelectItem>
                  <SelectItem value="dynamic">حسب عدد ضربات الليزر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">
                {formData.pricingType === "fixed" 
                  ? "السعر (ل.س)" 
                  : "سعر ضربة الليزر الواحدة (ل.س)"}
              </Label>
              <Input 
                id="price" 
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveService}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذه الخدمة؟ قد يؤثر ذلك على المواعيد والفواتير المرتبطة بها.
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

export default Services;
