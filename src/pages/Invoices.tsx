
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
  Printer,
  Edit,
  Plus,
  Search,
  Trash2,
  Receipt,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Sample invoices data
const initialInvoices = [
  {
    id: 1,
    client: "سارة أحمد",
    phone: "0956789123",
    date: "2025-04-10",
    time: "14:30",
    services: "وجه كامل",
    paymentType: "كاش",
    paidAmount: 50000,
    remainingAmount: 0,
    createdBy: "admin",
    serviceProvider: "د. رشا معتوق",
    totalAmount: 50000,
  },
  {
    id: 2,
    client: "رنا محمد",
    phone: "0932123456",
    date: "2025-04-12",
    time: "11:00",
    services: "ليزر كامل",
    paymentType: "تقسيط",
    paidAmount: 500000,
    remainingAmount: 25000,
    createdBy: "user1",
    serviceProvider: "مريم خليل",
    totalAmount: 525000,
  },
  {
    id: 3,
    client: "نور حسن",
    phone: "0945678901",
    date: "2025-04-15",
    time: "16:15",
    services: "فيلر شفايف",
    paymentType: "كاش",
    paidAmount: 350000,
    remainingAmount: 0,
    createdBy: "admin",
    serviceProvider: "د. رشا معتوق",
    totalAmount: 350000,
  },
];

const Invoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrintInvoice = (invoiceId: number) => {
    console.info(`Printing invoice: ${invoiceId}`);
    // Print invoice implementation
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client.includes(searchQuery) ||
      invoice.phone.includes(searchQuery) ||
      invoice.services.includes(searchQuery)
  );

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">الفواتير</h1>
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
            <Plus size={16} /> فاتورة جديدة
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">#</TableHead>
              <TableHead className="text-right">الزبون/ة</TableHead>
              <TableHead className="text-right">رقم الهاتف</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الخدمات</TableHead>
              <TableHead className="text-right">نوع الدفع</TableHead>
              <TableHead className="text-right">المبلغ المدفوع</TableHead>
              <TableHead className="text-right">المبلغ المتبقي</TableHead>
              <TableHead className="text-right">المبلغ الكلي</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.id}</TableCell>
                  <TableCell className="font-medium">{invoice.client}</TableCell>
                  <TableCell>{invoice.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{invoice.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.services}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        invoice.paymentType === "كاش"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}
                    >
                      {invoice.paymentType}
                    </span>
                  </TableCell>
                  <TableCell>{invoice.paidAmount.toLocaleString()} ل.س</TableCell>
                  <TableCell>
                    {invoice.remainingAmount > 0 
                      ? `${invoice.remainingAmount.toLocaleString()} ل.س` 
                      : "-"}
                  </TableCell>
                  <TableCell className="font-semibold">{invoice.totalAmount.toLocaleString()} ل.س</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="طباعة"
                        onClick={() => handlePrintInvoice(invoice.id)}
                      >
                        <Printer className="h-4 w-4" />
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
                    <Receipt className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-medium">لا توجد فواتير</h3>
                    <p className="text-muted-foreground text-sm">
                      قم بإضافة فواتير جديدة باستخدام زر "فاتورة جديدة"
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

export default Invoices;
