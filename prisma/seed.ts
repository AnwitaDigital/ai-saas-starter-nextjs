import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        passwordHash: hash,
        name: 'Admin',
        role: 'ADMIN',
        credits: 1000,
      },
      update: { role: 'ADMIN' },
    });
    console.log('Admin user upserted:', adminEmail);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
