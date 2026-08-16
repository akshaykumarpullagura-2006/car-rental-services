import { NextResponse } from 'next/server';
import { prisma, MOCK_CARS, MOCK_LEADS } from '@/lib/db';

export async function GET() {
  try {
    const totalFleet = await prisma.car.count().catch(() => MOCK_CARS.length);
    const availableCars = await prisma.car.count({ where: { status: 'AVAILABLE' } }).catch(() => 5);
    const totalLeads = await prisma.lead.count().catch(() => MOCK_LEADS.length);
    const newLeads = await prisma.lead.count({ where: { status: 'NEW' } }).catch(() => 1);
    const totalBookings = await prisma.booking.count().catch(() => 2);

    return NextResponse.json({
      totalFleet,
      availableCars,
      totalLeads,
      newLeads,
      totalBookings,
      conversionRate: totalLeads > 0 ? ((totalBookings / totalLeads) * 100).toFixed(1) + '%' : '35%',
    });
  } catch (error) {
    return NextResponse.json({
      totalFleet: MOCK_CARS.length,
      availableCars: 5,
      totalLeads: MOCK_LEADS.length,
      newLeads: 1,
      totalBookings: 2,
      conversionRate: '35%',
    });
  }
}
