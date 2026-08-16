import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { getLeadsStore, updateLeadStatusInStore, saveLeadInStore } from '@/lib/store';

// PATCH /api/leads/[id] - Admin authenticated update endpoint for status & notes
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updateData: Record<string, any> = {};

    if (body.status) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;

    // Try updating database if Prisma table exists
    await prisma.lead.update({
      where: { id: params.id },
      data: updateData,
    }).catch(() => null);

    // Update in-memory JSON file store
    let updatedLead: any = null;
    if (body.status) {
      updatedLead = updateLeadStatusInStore(params.id, body.status);
    }
    const currentLeads = getLeadsStore();
    const targetLead = currentLeads.find((l: any) => l.id === params.id);
    if (targetLead) {
      if (body.notes !== undefined) targetLead.notes = body.notes;
      if (body.status) targetLead.status = body.status;
      targetLead.updatedAt = new Date().toISOString();
      updatedLead = targetLead;
    }

    return NextResponse.json(updatedLead || { success: true, id: params.id, ...body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
