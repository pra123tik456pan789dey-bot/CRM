const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function cleanData() {
  console.log('Clearing sample dummy data from database...');
  if (prisma.invoiceItem) await prisma.invoiceItem.deleteMany({});
  if (prisma.invoice) await prisma.invoice.deleteMany({});
  if (prisma.ticket) await prisma.ticket.deleteMany({});
  if (prisma.workflowRule) await prisma.workflowRule.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.whatsAppMessage.deleteMany({});
  await prisma.callLog.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.lead.deleteMany({});
  
  console.log('✅ Database cleaned successfully! All sample leads, dummy phone numbers, fake call logs and demo chats removed.');
}

cleanData()
  .catch((e) => console.error("Clean error:", e))
  .finally(async () => {
    await prisma.$disconnect();
  });
