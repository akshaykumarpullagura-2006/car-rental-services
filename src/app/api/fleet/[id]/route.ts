import { NextResponse } from 'next/server';
import { getFleetStore, saveCarInStore, deleteCarFromStore } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cars = getFleetStore();
    const car = cars.find((c) => c.id === params.id || c.slug === params.id);
    return NextResponse.json(car || null);
  } catch (error) {
    return NextResponse.json(null);
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = saveCarInStore({ ...body, id: params.id });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vehicle record' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    deleteCarFromStore(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vehicle record' }, { status: 500 });
  }
}
