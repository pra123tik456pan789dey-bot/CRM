const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updateAllSuperAdminPasswords() {
  try {
    const password_hash = await bcrypt.hash('admin123', 10);

    // Update prateek1562@gmail.com to password admin123
    await prisma.user.updateMany({
      where: { email: 'prateek1562@gmail.com' },
      data: { password_hash, role: 'SUPERADMIN' }
    });

    // Also update admin@crm.com to password admin123
    await prisma.user.updateMany({
      where: { email: 'admin@crm.com' },
      data: { password_hash, role: 'SUPERADMIN' }
    });

    console.log("Updated SuperAdmin passwords to 'admin123' successfully!");
  } catch (err) {
    console.error("Error updating passwords:", err);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllSuperAdminPasswords();
