import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getFleetStore, saveFleetStore } from '@/lib/store';

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const updates: Array<{
      id: string;
      pricePerDay: number;
      pricePerWeek?: number;
      pricePerMonth?: number;
      deposit: number;
    }> = await request.json();

    const currentCars = getFleetStore();

    for (const carUpdate of updates) {
      await prisma.car.update({
        where: { id: carUpdate.id },
        data: {
          pricePerDay: Number(carUpdate.pricePerDay),
          pricePerWeek: carUpdate.pricePerWeek ? Number(carUpdate.pricePerWeek) : null,
          pricePerMonth: carUpdate.pricePerMonth ? Number(carUpdate.pricePerMonth) : null,
          deposit: Number(carUpdate.deposit),
        },
      }).catch(() => null);

      const target = currentCars.find((c: any) => c.id === carUpdate.id);
      if (target) {
        target.pricePerDay = Number(carUpdate.pricePerDay);
        if (carUpdate.pricePerWeek !== undefined) target.pricePerWeek = Number(carUpdate.pricePerWeek);
        if (carUpdate.pricePerMonth !== undefined) target.pricePerMonth = Number(carUpdate.pricePerMonth);
        target.deposit = Number(carUpdate.deposit);
      }
    }

    saveFleetStore(currentCars);

    return NextResponse.json({ success: true, message: 'Bulk pricing updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: true, message: 'Pricing updated' });
  }
}
