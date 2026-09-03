const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if we have the account
  const account = await prisma.whatsAppAccount.findFirst();
  
  if (!account) {
    console.log("No WhatsApp account found!");
    return;
  }

  // Create a dummy lead
  const lead = await prisma.lead.create({
    data: {
      name: 'Rohan Sharma (Test Client)',
      phone: '+919876543210',
      source: 'WHATSAPP',
      status: 'NEW',
    }
  });

  // Create dummy messages
  await prisma.whatsAppMessage.create({
    data: {
      lead_id: lead.id,
      whatsapp_acc_id: account.id,
      direction: 'INBOUND',
      message_text: 'Hi, I am interested in your services. Can you send me the pricing details?',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    }
  });

  await prisma.whatsAppMessage.create({
    data: {
      lead_id: lead.id,
      whatsapp_acc_id: account.id,
      direction: 'OUTBOUND',
      message_text: 'Hello Rohan! Welcome to NextGen CRM. Yes, our pricing starts at $99/mo. Would you like a demo?',
      status: 'READ',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
    }
  });
  
  await prisma.whatsAppMessage.create({
    data: {
      lead_id: lead.id,
      whatsapp_acc_id: account.id,
      direction: 'INBOUND',
      message_text: 'Yes please. Tomorrow at 10 AM works for me.',
      status: 'DELIVERED',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    }
  });

  console.log('Dummy chat created!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
