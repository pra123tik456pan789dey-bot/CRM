const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users:", users.map(u => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role })));
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
