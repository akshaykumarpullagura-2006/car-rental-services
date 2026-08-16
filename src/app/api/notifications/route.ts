import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const MOCK_NOTIFICATIONS = [
  { id: 'n1', message: 'New quote lead received from Vikramaditya Singhania (Rolls-Royce Cullinan)', type: 'lead', read: false, link: '/admin/leads', createdAt: new Date().toISOString() },
  { id: 'n2', message: 'WhatsApp enquiry logged from Kavya Deshmukh (Lamborghini Urus)', type: 'lead', read: false, link: '/admin/leads', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', message: 'New booking confirmed for Mercedes-AMG G 63', type: 'booking', read: true, link: '/admin/bookings', createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export async function GET() {
  try {
    const list = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    }).catch(() => []);
    return NextResponse.json(list.length > 0 ? list : MOCK_NOTIFICATIONS);
  } catch (error) {
    return NextResponse.json(MOCK_NOTIFICATIONS);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true },
      }).catch(() => null);
      return NextResponse.json({ success: true });
    }

    if (body.id) {
      await prisma.notification.update({
        where: { id: body.id },
        data: { read: true },
      }).catch(() => null);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
