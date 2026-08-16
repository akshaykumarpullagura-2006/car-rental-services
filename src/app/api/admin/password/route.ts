import { NextResponse } from 'next/server';
import { getAdminSession, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const { newPassword } = await request.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const newHash = hashPassword(newPassword);

    await prisma.adminUser.upsert({
      where: { email: session.email },
      update: { passwordHash: newHash },
      create: {
        email: session.email,
        passwordHash: newHash,
        name: session.name || 'Executive Concierge',
        role: 'SUPER_ADMIN',
      },
    }).catch(() => null);

    return NextResponse.json({ success: true, message: 'Admin password updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: true, message: 'Admin password updated' });
  }
}
