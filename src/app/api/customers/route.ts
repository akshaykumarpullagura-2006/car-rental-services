import { NextResponse } from 'next/server';
import { getLeadsStore, getBookingsStore } from '@/lib/store';

export async function GET() {
  try {
    const leads = getLeadsStore();
    const bookings = getBookingsStore();

    // Aggregate unique clients by phone number
    const customerMap = new Map<string, any>();

    leads.forEach((l: any) => {
      const phone = (l.clientPhone || '').trim();
      if (!phone) return;
      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          phone,
          name: l.clientName || 'Client',
          email: l.clientEmail || '',
          enquiries: [l],
          bookings: [],
          totalSpent: 0,
          lastActivity: l.createdAt || new Date().toISOString(),
        });
      } else {
        customerMap.get(phone).enquiries.push(l);
      }
    });

    bookings.forEach((b: any) => {
      const phone = (b.clientPhone || '').trim();
      if (!phone) return;
      if (!customerMap.has(phone)) {
        customerMap.set(phone, {
          phone,
          name: b.clientName || 'Client',
          email: b.clientEmail || '',
          enquiries: [],
          bookings: [b],
          totalSpent: Number(b.totalAmount || 0),
          lastActivity: b.createdAt || new Date().toISOString(),
        });
      } else {
        const cust = customerMap.get(phone);
        cust.bookings.push(b);
        cust.totalSpent += Number(b.totalAmount || 0);
      }
    });

    const customers = Array.from(customerMap.values());

    // If no customers yet, provide default demo customer profiles
    if (customers.length === 0) {
      return NextResponse.json([
        {
          phone: '+91 98765 43210',
          name: 'Vikramaditya Singhania',
          email: 'v.singhania@singhaniagroup.in',
          enquiries: [{ id: 'lead-101', carName: 'Rolls-Royce Cullinan', source: 'quote-modal', createdAt: new Date().toISOString() }],
          bookings: [{ id: 'book-101', bookingNumber: 'HM-BOOK-1001', carName: 'Rolls-Royce Cullinan', totalAmount: 185000, startDate: '2026-08-10', endDate: '2026-08-14' }],
          totalSpent: 185000,
          lastActivity: new Date().toISOString(),
        },
        {
          phone: '+91 91234 56789',
          name: 'Kavya Deshmukh',
          email: 'kavya@deshmukh.in',
          enquiries: [{ id: 'lead-102', carName: 'Lamborghini Urus', source: 'whatsapp-click', createdAt: new Date().toISOString() }],
          bookings: [],
          totalSpent: 0,
          lastActivity: new Date().toISOString(),
        }
      ]);
    }

    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json([]);
  }
}
