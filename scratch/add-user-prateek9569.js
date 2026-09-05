const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addPrateek9569() {
  try {
    const password_hash = await bcrypt.hash('admin123', 10);
    const company = await prisma.company.findFirst();

    if (!company) {
      console.error("No company found");
      return;
    }

    const email = 'prateek9569@gmail.com';
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { password_hash, role: 'SUPERADMIN' }
      });
      console.log(`Updated existing user ${email} password to 'admin123'!`);
    } else {
      await prisma.user.create({
        data: {
          company_id: company.id,
          name: 'Prateek Pandey',
          email,
          password_hash,
          role: 'SUPERADMIN',
          phone: '9876543210'
        }
      });
      console.log(`Created new SuperAdmin account for ${email} with password 'admin123'!`);
    }
  } catch (err) {
    console.error("Error creating/updating prateek9569:", err);
  } finally {
    await prisma.$disconnect();
  }
}

addPrateek9569();
