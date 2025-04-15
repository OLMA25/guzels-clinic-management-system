
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
import { Edit, Trash, Users } from "lucide-react";

// Sample data for demonstration
const sampleClients = [
  {
    id: 1,
    name: "سارة أحمد",
    phone: "0912345678",
    email: "sara@example.com",
    hairType: "كثيف",
    hairColor: "بني",
    skinType: "عادية",
    allergies: "لا يوجد",
    completedSessions: 8,
    remainingSessions: 4,
    favoriteServices: ["وجه كامل", "ساقين"],
    remainingPayments: 0,
    notes: "تفضل المواعيد الصباحية",
  },
  {
    id: 2,
    name: "رنا محمد",
    phone: "0923456789",
    email: "",
    hairType: "متوسط",
    hairColor: "أشقر",
    skinType: "حساسة",
    allergies: "بعض مواد التجميل",
    completedSessions: 3,
    remainingSessions: 5,
    favoriteServices: ["ليزر كامل"],
    remainingPayments: 25000,
    notes: "",
  },
  {
    id: 3,
    name: "نور حسن",
    phone: "0934567890",
    email: "noor@example.com",
    hairType: "ناعم",
    hairColor: "أسود",
    skinType: "دهنية",
    allergies: "لا يوجد",
    completedSessions: 0,
    remainingSessions: 6,
    favoriteServices: ["فيلر شفايف", "بوتكس"],
    remainingPayments: 75000,
    notes: "زبونة جديدة",
  },
];

// Options for select fields
const hairTypes = ["ناعم", "متوسط", "كثيف", "مجعد"];
const hairColors = ["أسود", "بني", "أشقر", "رمادي", "مصبوغ"];
const skinTypes = ["عادية", "دهنية", "جافة", "مختلطة", "حساسة"];

const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState(sampleClients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state for new/edit client
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    phone: "",
    email: "",
    hairType: "",
    hairColor: "",
    skinType: "",
    allergies: "",
    completedSessions: 0,
    remainingSessions: 0,
    favoriteServices: [] as string[],
    remainingPayments: 0,
    notes: "",
  });

  const handleAddNew = () => {
    setFormData({
      id: 0,
      name: "",
      phone: "",
      email: "",
      hairType: hairTypes[0],
      hairColor: hairColors[0],
      skinType: skinTypes[0],
      allergies: "",
      completedSessions: 0,
      remainingSessions: 0,
      favoriteServices: [],
      remainingPayments: 0,
      notes: "",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (client: any) => {
    setFormData({ ...client });
    setIsFormOpen(true);
  };

  const handleDelete = (client: any) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      setClients(clients.filter(c => c.id !== selectedClient.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSaveClient = () => {
    if (formData.id === 0) {
      // Add new
      setClients([...clients, { ...formData, id: clients.length + 1 }]);
    } else {
      // Update existing
      setClients(clients.map(c => (c.id === formData.id ? formData : c)));
    }
    setIsFormOpen(false);
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(client => 
    client.name.includes(searchQuery) || 
    client.phone.includes(searchQuery) ||
    (client.email && client.email.includes(searchQuery))
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الزبائن</h1>
        <Button onClick={handleAddNew}>
          <Users className="ml-2 h-4 w-4" />
          زبون جديد
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
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">رقم الهاتف</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">نوع الشعر</TableHead>
              <TableHead className="text-right">لون الشعر</TableHead>
              <TableHead className="text-right">نوع البشرة</TableHead>
              <TableHead className="text-right">الحساسية</TableHead>
              <TableHead className="text-right">عدد الجلسات الحالية</TableHead>
              <TableHead className="text-right">عدد الجلسات المتبقية</TableHead>
              <TableHead className="text-right">الخدمات الأكثر طلباً</TableHead>
              <TableHead className="text-right">الدفعات المتبقية</TableHead>
              <TableHead className="text-right">ملاحظات</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.id}</TableCell>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.email || "-"}</TableCell>
                  <TableCell>{client.hairType}</TableCell>
                  <TableCell>{client.hairColor}</TableCell>
                  <TableCell>{client.skinType}</TableCell>
                  <TableCell>{client.allergies || "لا يوجد"}</TableCell>
                  <TableCell>{client.completedSessions}</TableCell>
                  <TableCell>{client.remainingSessions}</TableCell>
                  <TableCell>{client.favoriteServices.join(", ")}</TableCell>
                  <TableCell>{client.remainingPayments > 0 ? `${client.remainingPayments} ل.س` : "-"}</TableCell>
                  <TableCell>{client.notes || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user?.isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {user?.isAdmin && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(client)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={14} className="text-center py-4 text-muted-foreground">
                  لا يوجد زبائن للعرض
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
            <DialogTitle>{formData.id !== 0 ? "تعديل بيانات الزبون" : "إضافة زبون جديد"}</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الزبون هنا. اضغط حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              <Label htmlFor="hairType">نوع الشعر</Label>
              <Select 
                value={formData.hairType}
                onValueChange={(value) => setFormData({...formData, hairType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الشعر" />
                </SelectTrigger>
                <SelectContent>
                  {hairTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hairColor">لون الشعر</Label>
              <Select 
                value={formData.hairColor}
                onValueChange={(value) => setFormData({...formData, hairColor: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر لون الشعر" />
                </SelectTrigger>
                <SelectContent>
                  {hairColors.map((color) => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="skinType">نوع البشرة</Label>
              <Select 
                value={formData.skinType}
                onValueChange={(value) => setFormData({...formData, skinType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع البشرة" />
                </SelectTrigger>
                <SelectContent>
                  {skinTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">الحساسية</Label>
              <Input 
                id="allergies" 
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                placeholder="لا يوجد"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedSessions">عدد الجلسات الحالية</Label>
              <Input 
                id="completedSessions" 
                type="number"
                value={formData.completedSessions}
                onChange={(e) => setFormData({...formData, completedSessions: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remainingSessions">عدد الجلسات المتبقية</Label>
              <Input 
                id="remainingSessions" 
                type="number"
                value={formData.remainingSessions}
                onChange={(e) => setFormData({...formData, remainingSessions: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favoriteServices">الخدمات الأكثر طلباً</Label>
              <Input 
                id="favoriteServices" 
                value={formData.favoriteServices.join(", ")}
                onChange={(e) => setFormData({...formData, favoriteServices: e.target.value.split(", ")})}
                placeholder="افصل بين الخدمات بفاصلة"
              />
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
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>إلغاء</Button>
            <Button onClick={handleSaveClient}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الزبون؟ سيتم حذف جميع البيانات المرتبطة به.
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

export default Clients;
