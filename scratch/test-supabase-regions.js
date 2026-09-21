const { PrismaClient } = require('@prisma/client');

async function testRegion(region, host) {
  const url = `postgresql://postgres.notxjzexnkzllysxtaag:Jaibabaki1%40%23%24@${host}:6543/postgres?pgbouncer=true`;
  console.log(`Testing ${region}: ${host}`);
  const prisma = new PrismaClient({
    datasources: { db: { url } }
  });
  try {
    const userCount = await prisma.user.count();
    console.log(`✅ SUCCESS ${region}: Found ${userCount} users!`);
  } catch (err) {
    console.error(`❌ FAILED ${region}:`, err.message);
  } finally {
    await prisma.$disconnect();
  }
}

async function runAll() {
  await testRegion("ap-south-1 (Mumbai)", "aws-0-ap-south-1.pooler.supabase.com");
  await testRegion("ap-southeast-1 (Singapore)", "aws-0-ap-southeast-1.pooler.supabase.com");
  await testRegion("us-east-1 (N. Virginia)", "aws-0-us-east-1.pooler.supabase.com");
  await testRegion("eu-central-1 (Frankfurt)", "aws-0-eu-central-1.pooler.supabase.com");
}

runAll();
