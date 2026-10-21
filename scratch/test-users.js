const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB count:", users.length);
  users.forEach(u => console.log(`- ${u.name} | Role: ${u.role} | Email: ${u.email} | Phone: ${u.phone}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
