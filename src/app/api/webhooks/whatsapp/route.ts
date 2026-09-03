import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint: Webhook Verification for Meta WhatsApp Cloud API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || "crm_verify_token_123";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("WhatsApp Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// POST endpoint: Incoming Messages & Status Updates Webhook Receiver
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;
          if (!value) continue;

          // 1. Process Incoming Messages
          if (value.messages && value.messages.length > 0) {
            for (const msg of value.messages) {
              const fromPhone = `+${msg.from}`;
              const messageText = msg.text?.body || msg.caption || "[Media / Interactive Message]";
              const metaId = msg.id;

              // Find or Auto-Create Lead
              let lead = await prisma.lead.findFirst({
                where: { phone: { contains: msg.from } }
              });

              if (!lead) {
                const company = await prisma.company.findFirst();
                lead = await prisma.lead.create({
                  data: {
                    name: value.contacts?.[0]?.profile?.name || `WhatsApp Contact (${msg.from})`,
                    phone: fromPhone,
                    source: "WHATSAPP",
                    status: "NEW",
                    company_id: company?.id || null
                  }
                });

                await prisma.activity.create({
                  data: {
                    contact_id: lead.id,
                    type: "STATUS_CHANGE",
                    content: `Auto-created lead from incoming WhatsApp message.`
                  }
                });
              }

              // Create WhatsApp Message record
              await prisma.whatsAppMessage.create({
                data: {
                  lead_id: lead.id,
                  direction: "INBOUND",
                  message_type: msg.type?.toUpperCase() || "TEXT",
                  message_text: messageText,
                  status: "READ",
                  meta_message_id: metaId
                }
              });

              // Add activity log
              await prisma.activity.create({
                data: {
                  contact_id: lead.id,
                  type: "WHATSAPP",
                  content: `Incoming WhatsApp: "${messageText.substring(0, 100)}"`
                }
              });
            }
          }

          // 2. Process Message Delivery & Read Receipts
          if (value.statuses && value.statuses.length > 0) {
            for (const statusItem of value.statuses) {
              const metaId = statusItem.id;
              const newStatus = statusItem.status?.toUpperCase(); // DELIVERED, READ, SENT, FAILED

              if (metaId && newStatus) {
                await prisma.whatsAppMessage.updateMany({
                  where: { meta_message_id: metaId },
                  data: { status: newStatus }
                });
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing WhatsApp webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
