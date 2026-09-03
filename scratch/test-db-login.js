const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("Connecting to Supabase Database...");
    const users = await prisma.user.findMany();
    console.log("Found Users Count:", users.length);
    for (const u of users) {
      console.log(`User: ${u.email} | Role: ${u.role} | Name: ${u.name}`);
      const isMatch = await bcrypt.compare('admin123', u.password_hash);
      console.log(`Password 'admin123' match test for ${u.email}:`, isMatch);
    }
  } catch (err) {
    console.error("DB Query Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
