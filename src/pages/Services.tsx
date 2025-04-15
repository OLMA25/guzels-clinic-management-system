
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
  Scissors,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Sample services data
const initialServices = [
  { id: 1, name: "وجه كامل", price: 50000 },
  { id: 2, name: "شارب", price: 0, dynamicPrice: true },
  { id: 3, name: "ذقن", price: 0, dynamicPrice: true },
  { id: 4, name: "كف اليد", price: 0, dynamicPrice: true },
  { id: 5, name: "ايدين كاملين", price: 150000 },
  { id: 6, name: "ساعدين", price: 80000 },
  { id: 7, name: "عضدين", price: 90000 },
  { id: 8, name: "رجلين كاملين", price: 250000 },
  { id: 9, name: "ساقين", price: 120000 },
  { id: 10, name: "فخذين", price: 150000 },
  { id: 11, name: "ارداف", price: 50000 },
  { id: 12, name: "بيكيني", price: 50000 },
  { id: 13, name: "ابط", price: 50000 },
  { id: 14, name: "ابط + بيكيني", price: 100000 },
  { id: 15, name: "بطن", price: 120000 },
  { id: 16, name: "خط السرة", price: 80000 },
  { id: 17, name: "اسفل الظهر", price: 0, dynamicPrice: true },
  { id: 18, name: "ظهر", price: 130000 },
  { id: 19, name: "جسم كامل", price: 700000 },
  { id: 20, name: "جسم كامل مع وجه وارداف", price: 750000 },
  { id: 21, name: "جسم جزئي", price: 550000 },
  { id: 22, name: "فيلر شفايف", price: 350000 },
];

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState(initialServices);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = services.filter(
    (service) =>
      service.name.includes(searchQuery) ||
      service.price.toString().includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">الخدمات والأسعار</h1>
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
          {user?.isAdmin && (
            <Button className="gap-1 whitespace-nowrap">
              <Plus size={16} /> خدمة جديدة
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right w-16">#</TableHead>
              <TableHead className="text-right">اسم الخدمة</TableHead>
              <TableHead className="text-right">سعر الخدمة</TableHead>
              {user?.isAdmin && (
                <TableHead className="text-center w-24">الإجراءات</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.id}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>
                    {service.dynamicPrice 
                      ? "حسب عدد ضربات الليزر (1,500 ل.س/ضربة)" 
                      : `${service.price.toLocaleString()} ل.س`}
                  </TableCell>
                  {user?.isAdmin && (
                    <TableCell>
                      <div className="flex justify-center gap-1">
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
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={user?.isAdmin ? 4 : 3} 
                  className="text-center py-10"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Scissors className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium">لا توجد خدمات</h3>
                    <p className="text-muted-foreground text-sm">
                      قم بإضافة خدمات جديدة باستخدام زر "خدمة جديدة"
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

export default Services;
