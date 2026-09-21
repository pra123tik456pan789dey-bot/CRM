const { PrismaClient } = require('@prisma/client');

async function testUrl(name, connectionString) {
  console.log(`\nTesting ${name}: ${connectionString}`);
  const prisma = new PrismaClient({
    datasources: { db: { url: connectionString } }
  });
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ SUCCESS ${name}: Found ${userCount} users!`);
  } catch (err) {
    console.error(`❌ FAILED ${name}:`, err.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function runTests() {
  await testUrl("Direct Supabase Domain (db.notxjzexnkzllysxtaag.supabase.co)", "postgresql://postgres:Jaibabaki1%40%23%24@db.notxjzexnkzllysxtaag.supabase.co:5432/postgres");
  await testUrl("AWS Pooler 6543 (pgbouncer)", "postgresql://postgres.notxjzexnkzllysxtaag:Jaibabaki1%40%23%24@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true");
  await testUrl("Session Pooler 5432", "postgresql://postgres.notxjzexnkzllysxtaag:Jaibabaki1%40%23%24@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres");
}

runTests();
