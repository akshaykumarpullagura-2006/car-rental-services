import fs from 'fs';
import path from 'path';
import { MOCK_CARS, MOCK_LEADS } from './db';
import { saveSupabaseCMS, saveSupabaseCar, saveSupabaseTestimonial, saveSupabaseLead } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.error('Error creating data directory:', e);
    }
  }
}

function readJsonFile<T>(filename: string, fallback: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    } catch (e) {
      console.error(`Error writing initial ${filename}:`, e);
    }
    return fallback;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${filename}:`, e);
    return fallback;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`Error writing ${filename}:`, e);
  }
}

// 1. CMS Store
export const DEFAULT_CMS_CONTENT: Record<string, string> = {
  hero_headline: 'Unrivaled Luxury. Exotic Performance.',
  hero_subheading: 'Drive Rolls-Royce, Lamborghini, Ferrari, and Maybach with bespoke concierge delivery.',
  hero_image_basic: '/images/swift-3d.png',
  hero_image_medium: '/images/thar-3d.jpg',
  hero_image_luxury: '/images/fortuner-3d.png',
  hero_image_ultraluxury: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1600&auto=format&fit=crop',
  whatsapp_number: '919876543210',
  instagram_url: 'https://instagram.com/hailmaryrentals',
  youtube_url: 'https://youtube.com/@hailmaryrentals',
  facebook_url: 'https://facebook.com/hailmaryrentals',
  linkedin_url: 'https://linkedin.com/company/hailmaryrentals',
  x_url: 'https://x.com/hailmaryrentals',
  direct_phone: '+91 98765 43210',
  contact_email: 'concierge@hailmaryrentals.com',
  address_line: 'Bandra Kurla Complex, Mumbai, MH 400051',
  business_hours: 'Showroom: 8:00 AM – 10:00 PM IST (24/7 WhatsApp Concierge)',
  stat_cars: '50+',
  stat_satisfaction: '99.8%',
  stat_handoff: '30 Min',
  stat_hidden_fees: '₹0',
  why_us_doorstep: 'Your chosen supercar or luxury SUV is detailed, sanitized, and delivered straight to your doorstep or airport terminal.',
  why_us_chauffeur: 'Prefer to be driven? Our licensed executive chauffeurs provide discreet, professional transport for VIP events and weddings.',
  intro_line_1: 'WELCOME TO',
  intro_line_2: 'HAIL MARY RENTAL SERVICES',
  flagship_car_id: 'car-urus-02',
  flagship_title: 'FLAGSHIP SPOTLIGHT',
  flagship_badge: 'Flagship Feature',
  about_badge: 'OUR HERITAGE',
  about_title: 'Redefining Luxury Vehicles',
  about_subheading: 'Hail Mary Rental Services delivers world-class automotive excellence with zero administrative friction.',
  about_heading_detail: 'Uncompromising Standards & Discretion',
  about_paragraph_1: 'We own and curate an elite fleet of exotic supercars, hyper-SUVs, and ultra-luxury limousines. Every car undergoes multi-point mechanical inspections and high-grade aesthetic detailing prior to every client handoff.',
  about_paragraph_2: 'Whether you require a Rolls-Royce Cullinan for a wedding weekend, a Lamborghini Urus for coastal touring, or a fleet of G-Wagons, our concierge manages every detail with complete discretion.',
  about_showroom_image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop',
  about_showroom_title: 'Flagship Showroom',
};

export function getCmsStore(): Record<string, string> {
  try {
    const fileData = readJsonFile<Record<string, string>>('cms.json', DEFAULT_CMS_CONTENT);
    if (fileData && typeof fileData === 'object' && !Array.isArray(fileData)) {
      return { ...DEFAULT_CMS_CONTENT, ...fileData };
    }
    return DEFAULT_CMS_CONTENT;
  } catch (e) {
    console.error('Error reading CMS store:', e);
    return DEFAULT_CMS_CONTENT;
  }
}

export function saveCmsStore(data: Record<string, string>): Record<string, string> {
  try {
    const current = getCmsStore();
    const updated = { ...current, ...data };
    writeJsonFile('cms.json', updated);
    saveSupabaseCMS(updated).catch(() => null);
    return updated;
  } catch (e) {
    console.error('Error saving CMS store:', e);
    return { ...DEFAULT_CMS_CONTENT, ...data };
  }
}

// 2. Fleet Store
export function getFleetStore() {
  return readJsonFile('fleet.json', MOCK_CARS);
}

export function saveFleetStore(cars: typeof MOCK_CARS) {
  writeJsonFile('fleet.json', cars);
  return cars;
}

export function saveCarInStore(carData: any) {
  const cars = getFleetStore();
  const existingIndex = cars.findIndex((c) => c.id === carData.id);
  if (existingIndex >= 0) {
    cars[existingIndex] = { ...cars[existingIndex], ...carData, updatedAt: new Date().toISOString() };
  } else {
    cars.unshift({ ...carData, id: carData.id || `car-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveFleetStore(cars);
  saveSupabaseCar(carData).catch(() => null);
  return carData;
}

export function deleteCarFromStore(id: string) {
  const cars = getFleetStore();
  const filtered = cars.filter((c) => c.id !== id);
  saveFleetStore(filtered);
  return true;
}

// 3. Testimonials Store
export const DEFAULT_TESTIMONIALS = [
  {
    id: 't-101',
    author: 'Rohan Kapoor',
    phone: '+91 98200 12345',
    rating: 5,
    content: 'Rented the Rolls-Royce Cullinan for a family wedding in Mumbai. Handoff was completed within 20 minutes at Bandra Kurla Complex. Absolute VIP experience!',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-102',
    author: 'Ananya Deshmukh',
    phone: '+91 99301 67890',
    rating: 5,
    content: 'The Mahindra Thar 4x4 was immaculate for our weekend drive. Pristine condition, smooth booking, and instant response on WhatsApp.',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-103',
    author: 'Vikramaditya Singhania',
    phone: '+91 98110 54321',
    rating: 5,
    content: 'Booked the Lamborghini Urus Performante for a corporate gala in Delhi NCR. The exhaust sound and supercar response were mind-blowing. Exceptional service!',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-104',
    author: 'Priya Nambiar',
    phone: '+91 97402 98765',
    rating: 5,
    content: 'Toyota Fortuner GR-Sport was delivered right to Bengaluru airport doorstep. Cleanest luxury SUV I have ever driven in India.',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-105',
    author: 'Aditya Verma',
    phone: '+91 98450 34567',
    rating: 5,
    content: 'Rented the Mercedes-AMG G 63 G-Wagon for a VIP road trip. Seamless paperwork, transparent deposit terms, and zero hidden charges.',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-106',
    author: 'Kavya Reddy',
    phone: '+91 99890 87654',
    rating: 5,
    content: 'The Porsche Taycan Turbo S EV was an absolute dream to drive in Hyderabad. Super fast charging setup and polite concierge team.',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-107',
    author: 'Rajesh Iyer',
    phone: '+91 98401 23456',
    rating: 5,
    content: 'Self-drove the Suzuki Swift ZXi for business meetings across Chennai. Extremely economical, clean interior, and effortless handoff.',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-108',
    author: 'Sneha Malhotra',
    phone: '+91 98180 76543',
    rating: 5,
    content: 'Mercedes-Maybach S 580 chauffeur service for our anniversary in Gurgaon was unforgettable. First-class luxury with reclining calf-rest seats!',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-109',
    author: 'Karan Bhasin',
    phone: '+91 98711 45678',
    rating: 5,
    content: 'Land Rover Defender 130 V8 had plenty of space for all 8 of us on our mountain retreat. Powerful engine and rugged comfort.',
    status: 'APPROVED',
    featured: true,
  },
  {
    id: 't-110',
    author: 'Devendra Patel',
    phone: '+91 98250 89012',
    rating: 5,
    content: 'Rented the BMW M4 Competition Convertible for a coastal drive in Gujarat. Top-tier supercar performance and instant WhatsApp booking.',
    status: 'APPROVED',
    featured: true,
  },
];

export function getTestimonialsStore(includeAll = false): any[] {
  const list: any[] = readJsonFile('testimonials.json', DEFAULT_TESTIMONIALS);
  if (includeAll) return list;
  return list.filter((t: any) => t.status === 'APPROVED' || !t.status);
}

export function saveTestimonialInStore(item: any) {
  const list = getTestimonialsStore(true);
  const newItem = {
    id: `t-${Date.now()}`,
    status: item.status || 'PENDING',
    rating: Number(item.rating || 5),
    createdAt: new Date().toISOString(),
    ...item,
  };
  list.unshift(newItem);
  writeJsonFile('testimonials.json', list);
  saveSupabaseTestimonial(newItem).catch(() => null);
  return newItem;
}

export function updateTestimonialStatusInStore(id: string, status: 'APPROVED' | 'DENIED') {
  const list: any[] = getTestimonialsStore(true);
  const item: any = list.find((t: any) => t.id === id);
  if (item) {
    item.status = status;
    item.updatedAt = new Date().toISOString();
    writeJsonFile('testimonials.json', list);
    saveSupabaseTestimonial(item).catch(() => null);
  }
  return item;
}

export function deleteTestimonialFromStore(id: string) {
  const list = getTestimonialsStore(true);
  const filtered = list.filter((t: any) => t.id !== id);
  writeJsonFile('testimonials.json', filtered);
  return true;
}

// 4. Leads Store
export function getLeadsStore(): any[] {
  return readJsonFile('leads.json', MOCK_LEADS);
}

export function saveLeadInStore(lead: any) {
  const list = getLeadsStore();
  const newLead = { id: `lead-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...lead };
  list.unshift(newLead);
  writeJsonFile('leads.json', list);
  saveSupabaseLead(newLead).catch(() => null);
  return newLead;
}

export function updateLeadStatusInStore(id: string, status: string) {
  const list: any[] = getLeadsStore();
  const item: any = list.find((l: any) => l.id === id);
  if (item) {
    item.status = status;
    item.updatedAt = new Date().toISOString();
    writeJsonFile('leads.json', list);
    saveSupabaseLead(item).catch(() => null);
  }
  return item;
}

// 5. Bookings Store
export function getBookingsStore(): any[] {
  return readJsonFile<any[]>('bookings.json', []);
}

export function saveBookingInStore(booking: any) {
  const list: any[] = getBookingsStore();
  const newBooking = {
    id: `book-${Date.now()}`,
    bookingNumber: `HM-BOOK-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    ...booking,
  };
  list.unshift(newBooking);
  writeJsonFile('bookings.json', list);
  return newBooking;
}

export function updateBookingStatusInStore(id: string, status: string) {
  const list: any[] = getBookingsStore();
  const item: any = list.find((b: any) => b.id === id);
  if (item) {
    item.status = status;
    item.updatedAt = new Date().toISOString();
    writeJsonFile('bookings.json', list);
  }
  return item;
}
