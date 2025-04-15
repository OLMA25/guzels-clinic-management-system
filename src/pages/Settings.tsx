
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clinic, 
  Printer, 
  Database, 
  Users, 
  Palette, 
  MessageSquare, 
  Save, 
  Upload, 
  UserPlus, 
  UserMinus, 
  User, 
  Check, 
  X
} from "lucide-react";
import { 
  getAllSettings, 
  updateSetting, 
  backupDatabase, 
  restoreDatabase,
  db,
  Provider
} from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useLiveQuery } from "dexie-react-hooks";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [newProvider, setNewProvider] = useState<Partial<Provider>>({
    name: "",
    phone: "",
    email: "",
    role: "فني",
    active: true
  });

  const { theme, setTheme } = useTheme();
  
  // استخدام useLiveQuery لاستعلام مباشر من قاعدة البيانات
  const providers = useLiveQuery(() => db.providers.toArray(), []);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const allSettings = await getAllSettings();
        setSettings(allSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("حدث خطأ أثناء تحميل الإعدادات");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await updateSetting(key, value);
      }
      
      // تحديث السمة إذا تم تغييرها
      if (settings.theme && settings.theme !== theme) {
        setTheme(settings.theme);
      }
      
      toast.success("تم حفظ الإعدادات بنجاح");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const result = await backupDatabase();
      toast.success(result);
    } catch (error) {
      console.error("Error creating backup:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ أثناء إنشاء النسخة الاحتياطية");
      }
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setRestoreLoading(true);
    try {
      const result = await restoreDatabase(file);
      toast.success(result);
      // إعادة تحميل الإعدادات بعد الاستعادة
      const allSettings = await getAllSettings();
      setSettings(allSettings);
    } catch (error) {
      console.error("Error restoring backup:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ أثناء استعادة النسخة الاحتياطية");
      }
    } finally {
      setRestoreLoading(false);
      // إعادة تعيين قيمة عنصر الإدخال للسماح باختيار نفس الملف مرة أخرى
      event.target.value = "";
    }
  };

  const handleAddProvider = async () => {
    try {
      if (!newProvider.name || !newProvider.phone) {
        toast.error("الرجاء إدخال الاسم ورقم الهاتف على الأقل");
        return;
      }

      await db.providers.add({
        ...newProvider as Provider,
        createdAt: new Date()
      });
      
      setNewProvider({
        name: "",
        phone: "",
        email: "",
        role: "فني",
        active: true
      });
      
      toast.success("تمت إضافة مقدم الخدمة بنجاح");
    } catch (error) {
      console.error("Error adding provider:", error);
      toast.error("حدث خطأ أثناء إضافة مقدم الخدمة");
    }
  };

  const toggleProviderStatus = async (id?: number) => {
    if (!id) return;
    
    try {
      const provider = await db.providers.get(id);
      if (provider) {
        await db.providers.update(id, { active: !provider.active });
        toast.success(`تم ${provider.active ? 'تعطيل' : 'تفعيل'} مقدم الخدمة بنجاح`);
      }
    } catch (error) {
      console.error("Error toggling provider status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة مقدم الخدمة");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full py-12">جاري تحميل الإعدادات...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">إعدادات النظام</h1>
      
      <Tabs defaultValue="clinic" className="w-full">
        <TabsList className="mb-6 flex flex-wrap justify-start">
          <TabsTrigger value="clinic" className="gap-2">
            <Clinic className="h-4 w-4" />
            <span>العيادة</span>
          </TabsTrigger>
          <TabsTrigger value="print" className="gap-2">
            <Printer className="h-4 w-4" />
            <span>الطباعة</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="gap-2">
            <Database className="h-4 w-4" />
            <span>النسخ الاحتياطي</span>
          </TabsTrigger>
          <TabsTrigger value="providers" className="gap-2">
            <Users className="h-4 w-4" />
            <span>مقدمو الخدمة</span>
          </TabsTrigger>
          <TabsTrigger value="interface" className="gap-2">
            <Palette className="h-4 w-4" />
            <span>الواجهة</span>
          </TabsTrigger>
          <TabsTrigger value="messaging" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>الرسائل</span>
          </TabsTrigger>
        </TabsList>
        
        {/* إعدادات العيادة */}
        <TabsContent value="clinic">
          <Card>
            <CardHeader>
              <CardTitle>معلومات العيادة</CardTitle>
              <CardDescription>
                تحديث المعلومات الأساسية للعيادة التي ستظهر في التقارير والفواتير
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="clinic_name">اسم العيادة</Label>
                  <Input 
                    id="clinic_name" 
                    value={settings.clinic_name || ""}
                    onChange={(e) => handleSettingChange('clinic_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinic_phone">رقم الهاتف</Label>
                  <Input 
                    id="clinic_phone" 
                    value={settings.clinic_phone || ""}
                    onChange={(e) => handleSettingChange('clinic_phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic_address">العنوان</Label>
                <Input 
                  id="clinic_address" 
                  value={settings.clinic_address || ""}
                  onChange={(e) => handleSettingChange('clinic_address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic_email">البريد الإلكتروني</Label>
                <Input 
                  id="clinic_email" 
                  type="email"
                  value={settings.clinic_email || ""}
                  onChange={(e) => handleSettingChange('clinic_email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* إعدادات الطباعة */}
        <TabsContent value="print">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الطباعة</CardTitle>
              <CardDescription>
                تخصيص مظهر الفواتير والتقارير المطبوعة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="print_header">ترويسة الطباعة</Label>
                <Input 
                  id="print_header" 
                  value={settings.print_header || ""}
                  onChange={(e) => handleSettingChange('print_header', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="print_footer">تذييل الطباعة</Label>
                <Input 
                  id="print_footer" 
                  value={settings.print_footer || ""}
                  onChange={(e) => handleSettingChange('print_footer', e.target.value)}
                />
              </div>
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">معاينة</h3>
                <div className="border p-4 rounded-md">
                  <div className="text-center font-bold mb-4">{settings.print_header || "عيادة جوزيل للتجميل"}</div>
                  <div className="h-40 border-dashed border-2 flex items-center justify-center text-muted-foreground">
                    محتوى الفاتورة أو التقرير
                  </div>
                  <div className="text-center text-sm mt-4">{settings.print_footer || "شكراً لزيارتكم"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* إعدادات النسخ الاحتياطي */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>النسخ الاحتياطي والاستعادة</CardTitle>
              <CardDescription>
                إنشاء نسخة احتياطية من البيانات أو استعادة نسخة سابقة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="backup_path">مسار النسخ الاحتياطي الافتراضي</Label>
                <Input 
                  id="backup_path" 
                  value={settings.backup_path || ""}
                  onChange={(e) => handleSettingChange('backup_path', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  هذا المسار يستخدم للنسخ الاحتياطي التلقائي، يمكنك تغييره حسب الحاجة
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">إنشاء نسخة احتياطية</h3>
                  <p className="text-sm text-muted-foreground">
                    قم بإنشاء نسخة احتياطية من جميع بيانات النظام بما في ذلك العملاء والمواعيد والفواتير والإعدادات
                  </p>
                  <Button 
                    onClick={handleBackup} 
                    disabled={backupLoading}
                    className="w-full"
                  >
                    {backupLoading ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية'}
                    <Save className="mr-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">استعادة من نسخة احتياطية</h3>
                  <p className="text-sm text-muted-foreground">
                    استعادة البيانات من نسخة احتياطية سابقة. هذا سيؤدي إلى استبدال البيانات الحالية.
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="restore-file"
                      accept=".json"
                      onChange={handleRestore}
                      disabled={restoreLoading}
                      className="hidden"
                    />
                    <Button
                      asChild
                      variant="outline"
                      disabled={restoreLoading}
                      className="w-full"
                    >
                      <label htmlFor="restore-file">
                        {restoreLoading ? 'جاري الاستعادة...' : 'استعادة من ملف'}
                        <Upload className="mr-2 h-4 w-4" />
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* إعدادات مقدمي الخدمة */}
        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>مقدمو الخدمة</CardTitle>
              <CardDescription>
                إدارة قائمة مقدمي الخدمة في العيادة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    إضافة مقدم خدمة جديد
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة مقدم خدمة جديد</DialogTitle>
                    <DialogDescription>
                      أدخل معلومات مقدم الخدمة الجديد
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-provider-name">الاسم</Label>
                      <Input 
                        id="new-provider-name" 
                        value={newProvider.name}
                        onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-provider-phone">رقم الهاتف</Label>
                      <Input 
                        id="new-provider-phone" 
                        value={newProvider.phone}
                        onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-provider-email">البريد الإلكتروني</Label>
                      <Input 
                        id="new-provider-email" 
                        type="email"
                        value={newProvider.email}
                        onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-provider-role">الدور</Label>
                      <Select 
                        value={newProvider.role} 
                        onValueChange={(value) => setNewProvider({...newProvider, role: value})}
                      >
                        <SelectTrigger id="new-provider-role">
                          <SelectValue placeholder="اختر الدور" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="طبيب">طبيب</SelectItem>
                          <SelectItem value="فني">فني</SelectItem>
                          <SelectItem value="مساعد">مساعد</SelectItem>
                          <SelectItem value="مدير">مدير</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="new-provider-active" className="ml-2">نشط</Label>
                      <Switch 
                        id="new-provider-active" 
                        checked={newProvider.active} 
                        onCheckedChange={(checked) => setNewProvider({...newProvider, active: checked})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button type="submit" onClick={handleAddProvider}>
                      إضافة
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>الدور</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers && providers.length > 0 ? (
                      providers.map((provider) => (
                        <TableRow key={provider.id}>
                          <TableCell className="font-medium">{provider.name}</TableCell>
                          <TableCell>{provider.phone}</TableCell>
                          <TableCell>{provider.role}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${provider.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {provider.active ? 'نشط' : 'غير نشط'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleProviderStatus(provider.id)}
                              className={provider.active ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}
                            >
                              {provider.active ? (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  تعطيل
                                </>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  تفعيل
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          لا يوجد مقدمي خدمة حتى الآن
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* إعدادات الواجهة */}
        <TabsContent value="interface">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الواجهة</CardTitle>
              <CardDescription>
                تخصيص مظهر وسلوك النظام
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">السمة</Label>
                <Select 
                  value={settings.theme || theme} 
                  onValueChange={(value) => handleSettingChange('theme', value)}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="اختر السمة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح</SelectItem>
                    <SelectItem value="dark">داكن</SelectItem>
                    <SelectItem value="system">حسب النظام</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Label htmlFor="rtl_enabled" className="ml-2">تفعيل واجهة من اليمين إلى اليسار</Label>
                <Switch 
                  id="rtl_enabled" 
                  checked={settings.rtl_enabled === "true"}
                  onCheckedChange={(checked) => handleSettingChange('rtl_enabled', checked ? "true" : "false")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* إعدادات الرسائل */}
        <TabsContent value="messaging">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الرسائل</CardTitle>
              <CardDescription>
                تكوين قوالب الرسائل للواتساب ورسائل التذكير
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_template">قالب رسالة الواتساب للتذكير بالموعد</Label>
                <Textarea 
                  id="whatsapp_template" 
                  rows={4}
                  value={settings.whatsapp_template || ""}
                  onChange={(e) => handleSettingChange('whatsapp_template', e.target.value)}
                  placeholder="أدخل قالب الرسالة هنا. يمكنك استخدام {client_name} و {appointment_date} و {appointment_time} كمتغيرات."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  المتغيرات المتاحة: {"{client_name}"} - {"{appointment_date}"} - {"{appointment_time}"} - {"{clinic_name}"}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email_template">قالب البريد الإلكتروني للتذكير بالموعد</Label>
                <Textarea 
                  id="email_template" 
                  rows={6}
                  value={settings.email_template || ""}
                  onChange={(e) => handleSettingChange('email_template', e.target.value)}
                  placeholder="أدخل قالب البريد الإلكتروني هنا. يمكنك استخدام {client_name} و {appointment_date} و {appointment_time} كمتغيرات."
                />
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">معاينة رسالة الواتساب</h3>
                <div className="border p-4 rounded-md bg-green-50">
                  <div className="text-sm">
                    {(settings.whatsapp_template || "")
                      .replace('{client_name}', 'سارة أحمد')
                      .replace('{appointment_date}', '15/04/2025')
                      .replace('{appointment_time}', '03:30 م')
                      .replace('{clinic_name}', settings.clinic_name || 'عيادة جوزيل للتجميل')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={saveSettings} disabled={saving} className="w-32">
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
