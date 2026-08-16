import { NextResponse } from 'next/server';
import { signAdminToken, AUTH_COOKIE_NAME, verifyPassword, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Try finding admin from database first
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    }).catch(() => null);

    let isValid = false;

    if (adminUser) {
      isValid = verifyPassword(password, adminUser.passwordHash);
    } else {
      // Fallback check for default seeded admin: admin@hailmaryrentals.com / AdminPass123!
      const defaultEmail = 'admin@hailmaryrentals.com';
      const defaultPass = 'AdminPass123!';
      if (email.toLowerCase() === defaultEmail && password === defaultPass) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = await signAdminToken({
      email: adminUser ? adminUser.email : 'admin@hailmaryrentals.com',
      name: adminUser ? adminUser.name : 'Executive Concierge Admin',
      role: 'SUPER_ADMIN',
    });

    const response = NextResponse.json({ success: true, message: 'Authentication successful' });
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 });
  }
}
