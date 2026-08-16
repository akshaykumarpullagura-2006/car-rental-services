import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeString } from '@/lib/sanitize';
import { sendLeadNotificationEmail } from '@/lib/email';
import { getLeadsStore, saveLeadInStore, updateLeadStatusInStore } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(getLeadsStore());
  } catch (error) {
    return NextResponse.json(getLeadsStore());
  }
}

// POST /api/leads - Public enquiry submission endpoint (Rate Limited, Sanitized, Auto Notification)
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const { success } = checkRateLimit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many enquiry attempts. Please wait a few minutes before trying again.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    const clientName = sanitizeString(body.clientName);
    const clientPhone = sanitizeString(body.clientPhone);

    if (!clientName || !clientPhone) {
      return NextResponse.json(
        { error: 'Client name and phone number are required.' },
        { status: 400 }
      );
    }

    const leadNumber = `HM-LEAD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newLead = saveLeadInStore({
      leadNumber,
      carId: sanitizeString(body.carId),
      carName: sanitizeString(body.carName),
      clientName,
      clientPhone,
      clientEmail: sanitizeString(body.clientEmail),
      startDate: sanitizeString(body.startDate),
      endDate: sanitizeString(body.endDate),
      location: sanitizeString(body.location),
      notes: sanitizeString(body.notes),
      source: sanitizeString(body.source) || 'contact-form',
      status: 'NEW',
      budget: sanitizeString(body.budget),
    });

    // 1. Create In-App Notification Record
    await prisma.notification.create({
      data: {
        message: `New ${newLead.source} lead received from ${newLead.clientName} (${newLead.carName || 'Fleet Inquiry'})`,
        type: 'lead',
        read: false,
        link: '/admin/leads',
      },
    }).catch(() => null);

    // 2. Asynchronously Trigger Email Notification to Admin
    sendLeadNotificationEmail({
      leadNumber: newLead.leadNumber,
      clientName: newLead.clientName,
      clientPhone: newLead.clientPhone,
      clientEmail: newLead.clientEmail,
      carName: newLead.carName,
      source: newLead.source,
      notes: newLead.notes,
    }).catch(() => null);

    return NextResponse.json(newLead);
  } catch (error) {
    const body = await request.json().catch(() => ({}));
    const mockLead = {
      id: `lead-${Date.now()}`,
      leadNumber: `HM-LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: sanitizeString(body.clientName) || 'Visitor',
      clientPhone: sanitizeString(body.clientPhone) || '+1 (555) 000-0000',
      clientEmail: sanitizeString(body.clientEmail),
      carName: sanitizeString(body.carName) || 'Fleet Inquiry',
      source: sanitizeString(body.source) || 'contact-form',
      status: 'NEW',
      notes: sanitizeString(body.notes),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Trigger email alert even on fallback path
    sendLeadNotificationEmail({
      leadNumber: mockLead.leadNumber,
      clientName: mockLead.clientName,
      clientPhone: mockLead.clientPhone,
      clientEmail: mockLead.clientEmail,
      carName: mockLead.carName,
      source: mockLead.source,
      notes: mockLead.notes,
    }).catch(() => null);

    return NextResponse.json(mockLead);
  }
}
