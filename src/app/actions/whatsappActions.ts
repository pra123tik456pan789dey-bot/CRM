"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendWhatsAppMessage(
  leadId: string,
  messageText: string,
  mediaUrl?: string,
  templateName?: string
) {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return { success: false, error: "Lead not found" };

    const account = await prisma.whatsAppAccount.findFirst({ where: { status: "CONNECTED" } });

    // Save message to DB
    const newMessage = await prisma.whatsAppMessage.create({
      data: {
        lead_id: leadId,
        whatsapp_acc_id: account?.id || null,
        direction: "OUTBOUND",
        message_type: templateName ? "TEMPLATE" : mediaUrl ? "IMAGE" : "TEXT",
        message_text: messageText,
        media_url: mediaUrl || null,
        status: "SENT",
        meta_message_id: `WAMID_${Date.now()}_${Math.random().toString(36).substring(7)}`
      }
    });

    // Create Activity Log
    await prisma.activity.create({
      data: {
        contact_id: leadId,
        type: "WHATSAPP",
        content: `WhatsApp message sent: "${messageText.substring(0, 80)}${messageText.length > 80 ? "..." : ""}"`
      }
    });

    // Call Meta Cloud API if token & phone number ID are present
    const metaToken = account?.accessToken || process.env.WHATSAPP_API_TOKEN;
    const phoneNumId = account?.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (metaToken && phoneNumId && lead.phone) {
      try {
        await fetch(`https://graph.facebook.com/v18.0/${phoneNumId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${metaToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: lead.phone.replace(/[^0-9]/g, ""),
            type: templateName ? "template" : "text",
            text: templateName ? undefined : { body: messageText },
            template: templateName ? { name: templateName, language: { code: "en_US" } } : undefined
          })
        });
      } catch (metaErr) {
        console.error("Meta API dispatch error (logged, DB saved):", metaErr);
      }
    }

    revalidatePath("/messages");
    revalidatePath(`/leads/${leadId}`);
    return { success: true, message: newMessage };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return { success: false, error: "Failed to send WhatsApp message" };
  }
}

export async function getWhatsAppConversations() {
  try {
    const leadsWithMessages = await prisma.lead.findMany({
      where: {
        messages: { some: {} }
      },
      include: {
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1
        },
        assignee: true
      },
      orderBy: { updatedAt: "desc" }
    });

    return leadsWithMessages;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

export async function getMessagesForLead(leadId: string) {
  try {
    const messages = await prisma.whatsAppMessage.findMany({
      where: { lead_id: leadId },
      orderBy: { timestamp: "asc" }
    });
    return messages;
  } catch (error) {
    console.error("Error fetching lead messages:", error);
    return [];
  }
}
