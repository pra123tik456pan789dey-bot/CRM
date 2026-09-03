import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phoneNumberId, whatsappBizId, accessToken } = body;

    if (!phoneNumberId || !whatsappBizId || !accessToken) {
      return new Response("Missing fields", { status: 400 });
    }

    const account = await prisma.whatsAppAccount.upsert({
      where: { phoneNumberId },
      update: { whatsappBizId, accessToken },
      create: { phoneNumberId, whatsappBizId, accessToken },
    });

    return new Response(JSON.stringify(account), { status: 200 });
  } catch (error) {
    console.error("Error saving WhatsApp account:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const accounts = await prisma.whatsAppAccount.findMany();
    return new Response(JSON.stringify(accounts), { status: 200 });
  } catch (error) {
    console.error("Error fetching WhatsApp accounts:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
