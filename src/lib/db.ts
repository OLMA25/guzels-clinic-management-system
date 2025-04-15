
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
  createdAt: Date;
}

export interface Setting {
  id?: number;
  key: string;
  value: string;
}

class AppDatabase extends Dexie {
  clients!: Table<Client, number>;
  appointments!: Table<Appointment, number>;
  services!: Table<Service, number>;
  invoices!: Table<Invoice, number>;
  settings!: Table<Setting, number>;

  constructor() {
    super("guzelClinicDB");
    this.version(1).stores({
      clients: "++id, name, phone, email",
      appointments: "++id, clientId, date, time, service",
      services: "++id, name, price",
      invoices: "++id, clientId, date, services, paymentType",
      settings: "++id, key"
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
}
