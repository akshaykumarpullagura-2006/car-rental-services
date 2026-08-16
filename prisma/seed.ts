import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  console.log('🌱 Seeding production database for Hail Mary Rental Services...');

  const adminEmail = (typeof process !== 'undefined' && process.env.ADMIN_EMAIL) || 'admin@hailmaryrentals.com';
  const adminPassword = (typeof process !== 'undefined' && process.env.ADMIN_INITIAL_PASSWORD) || 'AdminPass123!';
  const passwordHash = hashPassword(adminPassword);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { passwordHash },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      name: 'Executive Concierge Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Admin account seeded: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    if (typeof process !== 'undefined') process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
