import { NextResponse } from 'next/server';
import { getBookingsStore, saveBookingInStore, updateBookingStatusInStore } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    return NextResponse.json(getBookingsStore());
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBooking = saveBookingInStore(body);
    return NextResponse.json(newBooking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process booking' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }
    const updated = updateBookingStatusInStore(id, status);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
  }
}
