import { NextResponse } from 'next/server';
import { getCmsStore, saveCmsStore, DEFAULT_CMS_CONTENT } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = getCmsStore();
    return NextResponse.json(data || DEFAULT_CMS_CONTENT);
  } catch (error) {
    console.error('CMS API GET Error:', error);
    return NextResponse.json(DEFAULT_CMS_CONTENT);
  }
}

export async function POST(request: Request) {
  try {
    const body: Record<string, string> = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    const updated = saveCmsStore(body);
    return NextResponse.json({ success: true, message: 'CMS content updated successfully', cms: updated });
  } catch (error) {
    console.error('CMS API POST Error:', error);
    return NextResponse.json({ error: 'Failed to update CMS content' }, { status: 500 });
  }
}
