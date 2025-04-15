
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Define the form schema with Zod for validation
const serviceFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون اسم الخدمة على الأقل حرفين" }),
  price: z.coerce.number().min(0, { message: "يجب أن يكون السعر 0 أو أكثر" }),
  dynamicPrice: z.boolean().default(false),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  initialData?: {
    id?: number;
    name: string;
    price: number;
    dynamicPrice?: boolean;
  };
  onSubmit: (data: ServiceFormValues) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      dynamicPrice: initialData?.dynamicPrice || false,
    },
  });

  // Handle form submission
  const handleSubmit = (values: ServiceFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>اسم الخدمة</FormLabel>
              <FormControl>
                <Input placeholder="أدخل اسم الخدمة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dynamicPrice"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>سعر حسب عدد ضربات الليزر</FormLabel>
                <FormDescription>
                  اختر هذا الخيار إذا كان سعر الخدمة يعتمد على عدد ضربات الليزر
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>سعر الخدمة {form.watch("dynamicPrice") ? "(سعر ضربة الليزر)" : ""}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="أدخل السعر" 
                  {...field} 
                  disabled={form.watch("dynamicPrice")}
                  value={form.watch("dynamicPrice") ? 1500 : field.value}
                />
              </FormControl>
              <FormMessage />
              {form.watch("dynamicPrice") && (
                <FormDescription>
                  سعر ضربة الليزر الواحدة هو 1,500 ل.س
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button type="submit">
            {initialData?.id ? "تعديل الخدمة" : "إضافة خدمة"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;
