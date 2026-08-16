export interface CarGalleryItem {
  url: string;
  tag: 'Exterior' | 'Interior' | 'Dashboard' | 'Boot';
}

export interface Car {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Luxury' | 'Sports' | 'Electric' | 'Self Drive' | string;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual' | 'Dual-Clutch';
  seating: number;
  engine: string;
  horsepower: number;
  zeroToSixty: string;
  topSpeed: string;
  mileage: string; // e.g. "14 mpg" or "380 mi range"
  pricePerDay: number;
  pricePerWeek?: number | null;
  pricePerMonth?: number | null;
  deposit: number;
  driverCharges?: number;
  extraKmCharge?: number;
  status: 'AVAILABLE' | 'LIMITED' | 'RENTED' | 'COMING_SOON';
  featured: boolean;
  images: string[];
  gallery?: CarGalleryItem[];
  features: string[]; // ['AC', 'GPS', 'Bluetooth', 'Airbags', 'Automatic', 'Chauffeur Available']
  specs: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  carId?: string | null;
  carName?: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  notes?: string | null;
  status: 'NEW' | 'CONTACTED' | 'NEGOTIATING' | 'CONVERTED' | 'LOST';
  source: 'contact-form' | 'quote-modal' | 'whatsapp-click' | 'direct-call' | string;
  budget?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  leadId?: string | null;
  carId: string;
  carName?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  startDate: string;
  endDate: string;
  totalAmount: number;
  depositPaid: number;
  status: 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string | null;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  totalBookings: number;
  totalSpent: number;
  vipStatus: boolean;
  notes?: string | null;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  phone?: string | null;
  rating: number;
  content: string;
  avatarUrl?: string | null;
  featured: boolean;
  status?: 'APPROVED' | 'PENDING' | 'DENIED';
  createdAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string | null;
  featured: boolean;
}
