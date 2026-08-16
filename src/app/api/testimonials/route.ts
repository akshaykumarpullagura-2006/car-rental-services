import { NextResponse } from 'next/server';
import {
  getTestimonialsStore,
  saveTestimonialInStore,
  updateTestimonialStatusInStore,
  deleteTestimonialFromStore,
} from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeAll = searchParams.get('all') === 'true';
    return NextResponse.json(getTestimonialsStore(includeAll));
  } catch (error) {
    return NextResponse.json(getTestimonialsStore(false));
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isFromAdmin = Boolean(body.fromAdmin);
    const created = saveTestimonialInStore({
      ...body,
      status: isFromAdmin ? 'APPROVED' : (body.status || 'PENDING'),
    });
    return NextResponse.json(created);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }
    const updated = updateTestimonialStatusInStore(id, status);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update testimonial status' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      deleteTestimonialFromStore(id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
