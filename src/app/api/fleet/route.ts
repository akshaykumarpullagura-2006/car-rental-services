import { NextResponse } from 'next/server';
import { getFleetStore, saveCarInStore } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(getFleetStore());
  } catch (error) {
    return NextResponse.json(getFleetStore());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCar = saveCarInStore(body);
    return NextResponse.json(newCar);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save vehicle record' }, { status: 500 });
  }
}
