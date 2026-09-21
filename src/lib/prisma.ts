import { PrismaClient } from "@prisma/client";

const defaultDbUrl = "postgresql://postgres.notxjzexnkzllysxtaag:Jaibabaki1%40%23%24@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = defaultDbUrl;
}
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = defaultDbUrl;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || defaultDbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;


