
import Dexie, { Table } from "dexie";

// تعريف أنواع البيانات
export interface Client {
  id?: number;
  name: string;
  phone: string;
  email: string;
  hairType: string;
  hairColor: string;
  skinType: string;
  allergies: string;
  currentSessions: number;
  remainingSessions: number;
  mostRequestedServices: string;
  remainingPayments: number;
  notes: string;
  createdAt: Date;
}

export interface Appointment {
  id?: number;
  clientId: number;
  client: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  service: string;
  provider: string;
  notes: string;
  status: string;
  remainingPayments: number;
  createdAt: Date;
}

export interface Service {
  id?: number;
  name: string;
  price: number;
  dynamicPrice?: boolean;
  createdAt: Date;
}

export interface Invoice {
  id?: number;
  clientId: number;
  client: string;
  phone: string;
  date: string;
  time: string;
  services: string;
  paymentType: string;
  paidAmount: number;
  remainingAmount: number;
  createdBy: string;
  serviceProvider: string;
  totalAmount: number;
  notes?: string;
  createdAt: Date;
}

export interface Setting {
  id?: number;
  key: string;
  value: string;
}

export interface Provider {
  id?: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: Date;
}

class AppDatabase extends Dexie {
  clients!: Table<Client, number>;
  appointments!: Table<Appointment, number>;
  services!: Table<Service, number>;
  invoices!: Table<Invoice, number>;
  settings!: Table<Setting, number>;
  providers!: Table<Provider, number>;

  constructor() {
    super("guzelClinicDB");
    this.version(1).stores({
      clients: "++id, name, phone, email",
      appointments: "++id, clientId, date, time, service",
      services: "++id, name, price",
      invoices: "++id, clientId, date, services, paymentType",
      settings: "++id, key",
      providers: "++id, name, role, active"
    });
  }
}

export const db = new AppDatabase();

// إضافة بيانات أولية
export async function initializeDatabase() {
  // فحص إذا كانت البيانات موجودة من قبل
  const servicesCount = await db.services.count();
  if (servicesCount === 0) {
    // إضافة خدمات أولية
    const initialServices = [
      { name: "وجه كامل", price: 50000, dynamicPrice: false, createdAt: new Date() },
      { name: "شارب", price: 0, dynamicPrice: true, createdAt: new Date() },
      { name: "ذقن", price: 0, dynamicPrice: true, createdAt: new Date() },
      { name: "كف اليد", price: 0, dynamicPrice: true, createdAt: new Date() },
      { name: "ايدين كاملين", price: 150000, dynamicPrice: false, createdAt: new Date() },
      { name: "ساعدين", price: 80000, dynamicPrice: false, createdAt: new Date() },
      { name: "عضدين", price: 90000, dynamicPrice: false, createdAt: new Date() },
      { name: "رجلين كاملين", price: 250000, dynamicPrice: false, createdAt: new Date() },
      { name: "ساقين", price: 120000, dynamicPrice: false, createdAt: new Date() },
      { name: "فخذين", price: 150000, dynamicPrice: false, createdAt: new Date() },
      { name: "ارداف", price: 50000, dynamicPrice: false, createdAt: new Date() }
    ];
    await db.services.bulkAdd(initialServices);
  }

  const clientsCount = await db.clients.count();
  if (clientsCount === 0) {
    // إضافة عملاء أوليين
    const initialClients = [
      {
        name: "سارة أحمد",
        phone: "0956789123",
        email: "sara@example.com",
        hairType: "ناعم",
        hairColor: "أسود",
        skinType: "جافة",
        allergies: "نعم - لاتكس",
        currentSessions: 3,
        remainingSessions: 2,
        mostRequestedServices: "وجه كامل، ليزر ساقين",
        remainingPayments: 0,
        notes: "تفضل موعد بعد الظهر",
        createdAt: new Date()
      }
    ];
    await db.clients.bulkAdd(initialClients);
  }

  // إضافة مقدمي الخدمة الافتراضيين
  const providersCount = await db.providers.count();
  if (providersCount === 0) {
    const initialProviders = [
      {
        name: "د. منى محمد",
        phone: "0912345678",
        email: "mona@guzelclinic.com",
        role: "طبيب",
        active: true,
        createdAt: new Date()
      },
      {
        name: "ليلى أحمد",
        phone: "0923456789",
        email: "layla@guzelclinic.com",
        role: "فني",
        active: true,
        createdAt: new Date()
      }
    ];
    await db.providers.bulkAdd(initialProviders);
  }

  // إضافة الإعدادات الافتراضية
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    const defaultSettings = [
      { key: "clinic_name", value: "عيادة جوزيل للتجميل" },
      { key: "clinic_address", value: "دمشق - المزة - شارع الفردوس" },
      { key: "clinic_phone", value: "0911234567" },
      { key: "clinic_email", value: "info@guzelclinic.com" },
      { key: "backup_path", value: "C:/GuzelBackups" },
      { key: "print_header", value: "عيادة جوزيل للتجميل - خدمات الليزر والتجميل" },
      { key: "print_footer", value: "شكراً لزيارتكم - للحجز: 0911234567" },
      { key: "whatsapp_template", value: "مرحباً {client_name}، نود تذكيركم بموعدكم في عيادة جوزيل يوم {appointment_date} الساعة {appointment_time}" },
      { key: "theme", value: "light" }
    ];
    await db.settings.bulkAdd(defaultSettings);
  }
}

// استرجاع الاعدادات من قاعدة البيانات
export async function getSetting(key: string): Promise<string> {
  const setting = await db.settings.where("key").equals(key).first();
  return setting ? setting.value : "";
}

// تحديث إعداد معين
export async function updateSetting(key: string, value: string): Promise<void> {
  const setting = await db.settings.where("key").equals(key).first();
  if (setting) {
    await db.settings.update(setting.id!, { value });
  } else {
    await db.settings.add({ key, value });
  }
}

// استرجاع جميع الاعدادات
export async function getAllSettings(): Promise<Record<string, string>> {
  const settings = await db.settings.toArray();
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);
}

// إجراء النسخ الاحتياطي
export async function backupDatabase(): Promise<string> {
  try {
    const clients = await db.clients.toArray();
    const appointments = await db.appointments.toArray();
    const services = await db.services.toArray();
    const invoices = await db.invoices.toArray();
    const settings = await db.settings.toArray();
    const providers = await db.providers.toArray();

    const data = {
      clients,
      appointments,
      services,
      invoices,
      settings,
      providers,
      timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `guzel_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return "تم إنشاء النسخة الاحتياطية بنجاح";
  } catch (error) {
    console.error("خطأ في إنشاء النسخة الاحتياطية:", error);
    throw new Error("فشل إنشاء النسخة الاحتياطية");
  }
}

// استعادة النسخ الاحتياطي
export async function restoreDatabase(backupFile: File): Promise<string> {
  try {
    const fileContent = await backupFile.text();
    const data = JSON.parse(fileContent);

    // حذف البيانات الحالية
    await db.clients.clear();
    await db.appointments.clear();
    await db.services.clear();
    await db.invoices.clear();
    await db.settings.clear();
    await db.providers.clear();

    // استعادة البيانات من النسخة الاحتياطية
    if (data.clients?.length) await db.clients.bulkAdd(data.clients);
    if (data.appointments?.length) await db.appointments.bulkAdd(data.appointments);
    if (data.services?.length) await db.services.bulkAdd(data.services);
    if (data.invoices?.length) await db.invoices.bulkAdd(data.invoices);
    if (data.settings?.length) await db.settings.bulkAdd(data.settings);
    if (data.providers?.length) await db.providers.bulkAdd(data.providers);

    return "تمت استعادة النسخة الاحتياطية بنجاح";
  } catch (error) {
    console.error("خطأ في استعادة النسخة الاحتياطية:", error);
    throw new Error("فشل استعادة النسخة الاحتياطية");
  }
}
