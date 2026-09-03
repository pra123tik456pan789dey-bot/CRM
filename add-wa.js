const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const account = await prisma.whatsAppAccount.upsert({
    where: { phoneNumberId: '1222865254241480' },
    update: {
      whatsappBizId: '1957466684746523',
      accessToken: 'EAAYRczMkQBYBR8ZCTRH20iLZArUTgj9R62EScmz5gSTbeSnriMExu7ehk9wCxsPaAPktr46ZCYUuZAqPV32nkOJiBVW83Qt1TnWHWug7NiRVOZBCeJeuguT0tPZBbE27T3NbcdoJ7Cv4ZAvHI2vliFLZCaJaLnWFuYHUZCLIG5RuMVhx7o1ykHE8mzcfDhDh3pqgPEUsoiUBAdPLxt5ryd3CMMCe1Tj985Kqo4YtEbZCQZAVCf7w3Mn24YZCH5ubrPGoxfHSZBKB4qxmDg5IsAtunhDBujC69'
    },
    create: {
      phoneNumberId: '1222865254241480',
      whatsappBizId: '1957466684746523',
      accessToken: 'EAAYRczMkQBYBR8ZCTRH20iLZArUTgj9R62EScmz5gSTbeSnriMExu7ehk9wCxsPaAPktr46ZCYUuZAqPV32nkOJiBVW83Qt1TnWHWug7NiRVOZBCeJeuguT0tPZBbE27T3NbcdoJ7Cv4ZAvHI2vliFLZCaJaLnWFuYHUZCLIG5RuMVhx7o1ykHE8mzcfDhDh3pqgPEUsoiUBAdPLxt5ryd3CMMCe1Tj985Kqo4YtEbZCQZAVCf7w3Mn24YZCH5ubrPGoxfHSZBKB4qxmDg5IsAtunhDBujC69'
    }
  });
  console.log('Account saved:', account);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
