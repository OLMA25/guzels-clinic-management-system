
import React, { useState, useEffect, useRef } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Printer,
  Edit,
  Plus,
  Search,
  Trash2,
  Receipt,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db, Invoice } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import InvoiceForm from "@/components/invoices/InvoiceForm";

const Invoices = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  // استعلام مباشر من قاعدة البيانات
  const invoices = useLiveQuery(
    () => db.invoices.orderBy("id").reverse().toArray(),
    []
  );

  const filteredInvoices = invoices
    ? invoices.filter(
        (invoice) =>
          invoice.client.includes(searchQuery) ||
          invoice.phone.includes(searchQuery) ||
          invoice.services.includes(searchQuery)
      )
    : [];

  // إضافة فاتورة جديدة
  const handleAddInvoice = () => {
    setCurrentInvoice(null);
    setIsFormDialogOpen(true);
  };

  // تحرير فاتورة موجودة
  const handleEditInvoice = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsFormDialogOpen(true);
  };

  // حذف فاتورة
  const handleDeleteClick = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsDeleteDialogOpen(true);
  };

  // تأكيد حذف الفاتورة
  const handleDeleteInvoice = async () => {
    if (currentInvoice?.id) {
      try {
        await db.invoices.delete(currentInvoice.id);
        toast.success("تم حذف الفاتورة بنجاح");
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("خطأ في حذف الفاتورة:", error);
        toast.error("حدث خطأ أثناء حذف الفاتورة");
      }
    }
  };

  // معالجة تقديم نموذج الفاتورة
  const handleFormSubmit = async (formData: Partial<Invoice>) => {
    try {
      if (currentInvoice?.id) {
        // تحديث فاتورة موجودة
        await db.invoices.update(currentInvoice.id, {
          ...formData,
        });
        toast.success("تم تحديث الفاتورة بنجاح");
      } else {
        // إضافة فاتورة جديدة
        const newInvoice = {
          ...formData,
          createdAt: new Date(),
        } as Invoice;
        
        await db.invoices.add(newInvoice);
        toast.success("تمت إضافة الفاتورة بنجاح");
      }
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error("خطأ في حفظ الفاتورة:", error);
      toast.error("حدث خطأ أثناء حفظ الفاتورة");
    }
  };

  // طباعة الفاتورة
  const handlePrintInvoice = (invoice: Invoice) => {
    // إنشاء محتوى الفاتورة للطباعة
    const printContent = `
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <title>فاتورة رقم ${invoice.id}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            direction: rtl;
            padding: 20px;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .invoice-header h1 {
            margin: 0;
            color: #9b87f5;
          }
          .invoice-details {
            margin-bottom: 30px;
          }
          .invoice-details table {
            width: 100%;
            border-collapse: collapse;
          }
          .invoice-details table td {
            padding: 8px;
          }
          .invoice-items {
            margin-bottom: 30px;
          }
          .invoice-items table {
            width: 100%;
            border-collapse: collapse;
          }
          .invoice-items table th, .invoice-items table td {
            border: 1px solid #ddd;
            padding: 12px 8px;
            text-align: right;
          }
          .invoice-items table th {
            background-color: #f2f2f2;
          }
          .invoice-total {
            margin-top: 30px;
            text-align: left;
          }
          .invoice-total table {
            width: 300px;
            margin-left: auto;
          }
          .invoice-total table td {
            padding: 8px;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>عيادة جوزل للتجميل</h1>
          <p>دمشق - سوريا | هاتف: 0965555555</p>
          <h2>فاتورة رقم: ${invoice.id}</h2>
        </div>
        
        <div class="invoice-details">
          <table>
            <tr>
              <td><strong>اسم الزبون:</strong></td>
              <td>${invoice.client}</td>
              <td><strong>التاريخ:</strong></td>
              <td>${invoice.date}</td>
            </tr>
            <tr>
              <td><strong>رقم الهاتف:</strong></td>
              <td>${invoice.phone}</td>
              <td><strong>الوقت:</strong></td>
              <td>${invoice.time}</td>
            </tr>
            <tr>
              <td><strong>مقدم الخدمة:</strong></td>
              <td>${invoice.serviceProvider}</td>
              <td><strong>طريقة الدفع:</strong></td>
              <td>${invoice.paymentType}</td>
            </tr>
          </table>
        </div>
        
        <div class="invoice-items">
          <table>
            <thead>
              <tr>
                <th>الخدمة</th>
                <th>المبلغ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.services}</td>
                <td>${invoice.totalAmount.toLocaleString()} ل.س</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="invoice-total">
          <table>
            <tr>
              <td><strong>المبلغ الكلي:</strong></td>
              <td>${invoice.totalAmount.toLocaleString()} ل.س</td>
            </tr>
            <tr>
              <td><strong>المبلغ المدفوع:</strong></td>
              <td>${invoice.paidAmount.toLocaleString()} ل.س</td>
            </tr>
            <tr>
              <td><strong>المبلغ المتبقي:</strong></td>
              <td>${invoice.remainingAmount.toLocaleString()} ل.س</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          <p>شكراً لزيارتكم عيادة جوزل للتجميل</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    // إنشاء iframe للطباعة وتحديث محتواه
    if (printFrameRef.current) {
      const iframe = printFrameRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(printContent);
        iframeDoc.close();
      }
    }
  };

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
          <Button className="gap-1 whitespace-nowrap" onClick={handleAddInvoice}>
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
            {!invoices ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                    <h3 className="font-medium">جارِ التحميل...</h3>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredInvoices.length > 0 ? (
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
                        onClick={() => handlePrintInvoice(invoice)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      {user?.isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="تعديل"
                            onClick={() => handleEditInvoice(invoice)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="حذف"
                            onClick={() => handleDeleteClick(invoice)}
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

      {/* نموذج إضافة/تعديل فاتورة */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentInvoice ? "تعديل فاتورة" : "إضافة فاتورة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <InvoiceForm 
            initialData={currentInvoice || undefined} 
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* تأكيد حذف فاتورة */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الفاتورة؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الفاتورة نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* إطار مخفي للطباعة */}
      <iframe
        ref={printFrameRef}
        style={{ display: 'none' }}
        title="إطار الطباعة"
      />
    </div>
  );
};

export default Invoices;
