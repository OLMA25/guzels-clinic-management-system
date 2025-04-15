
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { db, Client, Service, Invoice } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";
import { format, parse } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Schema للتحقق من نموذج الفاتورة
const invoiceFormSchema = z.object({
  clientId: z.coerce.number().min(1, { message: "يرجى اختيار زبون" }),
  client: z.string().min(2, { message: "يجب إدخال اسم الزبون" }),
  phone: z.string().min(9, { message: "يجب إدخال رقم هاتف صحيح" }),
  date: z.string().min(1, { message: "يرجى تحديد تاريخ" }),
  time: z.string().min(1, { message: "يرجى تحديد وقت" }),
  serviceId: z.coerce.number().min(1, { message: "يرجى اختيار خدمة" }),
  services: z.string().min(1, { message: "يرجى إدخال اسم الخدمة" }),
  serviceProvider: z.string().min(2, { message: "يرجى تحديد مقدم الخدمة" }),
  paymentType: z.string().min(1, { message: "يرجى اختيار طريقة الدفع" }),
  paidAmount: z.coerce.number().min(0, { message: "يجب أن يكون المبلغ المدفوع 0 أو أكثر" }),
  totalAmount: z.coerce.number().min(0, { message: "يجب أن يكون المبلغ الكلي أكبر من 0" }),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  initialData?: Partial<Invoice>;
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
}

const serviceProviders = [
  "د. رشا معتوق",
  "مريم خليل",
  "سارة نبيل",
  "نور حسن"
];

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialData?.date ? parse(initialData.date, "yyyy-MM-dd", new Date()) : new Date()
  );

  // استرجاع قوائم الزبائن والخدمات من قاعدة البيانات
  const clients = useLiveQuery(() => db.clients.toArray());
  const services = useLiveQuery(() => db.services.toArray());

  // تهيئة نموذج التحقق مع قيم أولية
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientId: initialData?.clientId || 0,
      client: initialData?.client || "",
      phone: initialData?.phone || "",
      date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
      time: initialData?.time || format(new Date(), "HH:mm"),
      serviceId: 0,
      services: initialData?.services || "",
      serviceProvider: initialData?.serviceProvider || serviceProviders[0],
      paymentType: initialData?.paymentType || "كاش",
      paidAmount: initialData?.paidAmount || 0,
      totalAmount: initialData?.totalAmount || 0,
      notes: initialData?.notes || "",
    },
  });

  // معالجة تغيير اختيار الزبون
  const handleClientChange = (clientId: number) => {
    const selectedClient = clients?.find(c => c.id === clientId);
    if (selectedClient) {
      form.setValue("client", selectedClient.name);
      form.setValue("phone", selectedClient.phone);
    }
  };

  // معالجة تغيير اختيار الخدمة
  const handleServiceChange = (serviceId: number) => {
    const selectedService = services?.find(s => s.id === serviceId);
    if (selectedService) {
      form.setValue("services", selectedService.name);
      form.setValue("totalAmount", selectedService.price);
      form.setValue("paidAmount", selectedService.price);
    }
  };

  // معالجة تغيير المبلغ الكلي للحساب التلقائي للمبلغ المتبقي
  const calculateRemainingAmount = () => {
    const totalAmount = form.watch("totalAmount") || 0;
    const paidAmount = form.watch("paidAmount") || 0;
    return totalAmount - paidAmount;
  };

  // معالجة تقديم النموذج
  const handleSubmit = (values: InvoiceFormValues) => {
    const remainingAmount = calculateRemainingAmount();
    const invoiceData: Partial<Invoice> = {
      ...values,
      remainingAmount,
      createdBy: user?.username || "unknown"
    };
    onSubmit(invoiceData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* اختيار الزبون */}
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الزبون</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(Number(value));
                  handleClientChange(Number(value));
                }}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الزبون" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      {client.name} - {client.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* اسم الزبون */}
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الزبون</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* رقم الهاتف */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رقم الهاتف</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* التاريخ */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>التاريخ</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(parse(field.value, "yyyy-MM-dd", new Date()), "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        field.onChange(format(date, "yyyy-MM-dd"));
                      }
                    }}
                    locale={ar}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* الوقت */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الوقت</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* اختيار الخدمة */}
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الخدمة</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(Number(value));
                  handleServiceChange(Number(value));
                }}
                defaultValue={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الخدمة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={String(service.id)}>
                      {service.name} - {service.dynamicPrice ? "حسب الضربات" : `${service.price.toLocaleString()} ل.س`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* اسم الخدمة */}
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>وصف الخدمات</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* مقدم الخدمة */}
        <FormField
          control={form.control}
          name="serviceProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>مقدم الخدمة</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مقدم الخدمة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serviceProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* طريقة الدفع */}
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>طريقة الدفع</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="كاش">كاش</SelectItem>
                  <SelectItem value="تقسيط">تقسيط</SelectItem>
                  <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* المبلغ الكلي */}
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المبلغ الكلي</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => {
                  field.onChange(e);
                  // إذا كان المبلغ المدفوع معادل للمبلغ الكلي، قم بتحديثه تلقائيًا
                  if (form.watch("paidAmount") === form.watch("totalAmount")) {
                    form.setValue("paidAmount", Number(e.target.value));
                  }
                }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* المبلغ المدفوع */}
        <FormField
          control={form.control}
          name="paidAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المبلغ المدفوع</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* المبلغ المتبقي - عرض فقط */}
        <div className="space-y-1">
          <Label>المبلغ المتبقي</Label>
          <Input 
            type="number" 
            value={calculateRemainingAmount()} 
            disabled 
            className="bg-muted"
          />
        </div>

        {/* ملاحظات */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit">
            {initialData?.id ? "تحديث الفاتورة" : "إنشاء الفاتورة"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
