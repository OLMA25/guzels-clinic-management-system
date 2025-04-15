
import React from "react";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          مرحباً بك في نظام إدارة مركز غزل للتجميل
        </h1>
        <p className="text-muted-foreground mt-2">
          {user?.isAdmin 
            ? "مرحباً بك في لوحة التحكم كمدير للنظام. يمكنك الوصول إلى جميع الميزات."
            : "مرحباً بك في لوحة التحكم. بعض الميزات قد تكون مقيدة حسب صلاحياتك."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="rounded-xl bg-secondary/50 border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">إحصائيات سريعة</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/80 p-4 rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground">المواعيد اليوم</p>
              <p className="text-2xl font-bold text-primary">8</p>
            </div>
            <div className="bg-background/80 p-4 rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground">الزبائن النشطين</p>
              <p className="text-2xl font-bold text-primary">340</p>
            </div>
            <div className="bg-background/80 p-4 rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground">الخدمات المقدمة</p>
              <p className="text-2xl font-bold text-primary">25</p>
            </div>
            <div className="bg-background/80 p-4 rounded-lg border border-border text-center">
              <p className="text-xs text-muted-foreground">الفواتير هذا الشهر</p>
              <p className="text-2xl font-bold text-primary">142</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-secondary/50 border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">المواعيد القادمة</h2>
          <div className="space-y-3">
            <div className="bg-background/80 p-3 rounded-lg border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">سارة أحمد</p>
                  <p className="text-sm text-muted-foreground">وجه كامل</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">اليوم</p>
                  <p className="text-muted-foreground">14:30</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background/80 p-3 rounded-lg border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">رنا محمد</p>
                  <p className="text-sm text-muted-foreground">ليزر كامل</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">غداً</p>
                  <p className="text-muted-foreground">11:00</p>
                </div>
              </div>
            </div>
            
            <div className="bg-background/80 p-3 rounded-lg border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">نور حسن</p>
                  <p className="text-sm text-muted-foreground">فيلر شفايف</p>
                </div>
                <div className="text-sm text-right">
                  <p className="font-medium">بعد غد</p>
                  <p className="text-muted-foreground">16:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
