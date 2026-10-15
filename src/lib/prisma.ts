import { PrismaClient } from "@prisma/client";

const defaultDbUrl = "postgresql://neondb_owner:npg_so3lJbi0LNTD@ep-small-leaf-b5t4zxzq-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require";

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


