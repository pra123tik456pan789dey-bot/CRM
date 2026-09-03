"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllWhatsAppAccounts() {
  try {
    const accounts = await prisma.whatsAppAccount.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        team: true,
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return accounts;
  } catch (error) {
    console.error("Error fetching WhatsApp accounts:", error);
    return [];
  }
}

export async function registerWhatsAppAccount(data: {
  phoneNumberId: string;
  assigned_to_user?: string;
  session_name?: string;
}) {
  try {
    const company = await prisma.company.findFirst();
    const existing = await prisma.whatsAppAccount.findUnique({
      where: { phoneNumberId: data.phoneNumberId },
    });

    if (existing) {
      const updated = await prisma.whatsAppAccount.update({
        where: { id: existing.id },
        data: {
          assigned_to_user: data.assigned_to_user || existing.assigned_to_user,
          session_name: data.session_name || existing.session_name,
          status: "CONNECTED",
          last_active: new Date(),
        },
      });
      revalidatePath("/super-admin");
      revalidatePath("/messages");
      return { success: true, account: updated };
    }

    const newAccount = await prisma.whatsAppAccount.create({
      data: {
        company_id: company?.id || null,
        phoneNumberId: data.phoneNumberId,
        session_name: data.session_name || `session-emp-${Math.floor(Math.random() * 1000)}`,
        assigned_to_user: data.assigned_to_user || null,
        status: "CONNECTED",
        last_active: new Date(),
      },
    });

    revalidatePath("/super-admin");
    revalidatePath("/messages");
    return { success: true, account: newAccount };
  } catch (error: any) {
    console.error("Error registering WhatsApp account:", error);
    return { success: false, error: error.message || "Failed to register WhatsApp account" };
  }
}

export async function toggleAccountStatus(accountId: string, newStatus: string) {
  try {
    const account = await prisma.whatsAppAccount.update({
      where: { id: accountId },
      data: { status: newStatus, last_active: new Date() },
    });

    revalidatePath("/super-admin");
    return { success: true, account };
  } catch (error) {
    console.error("Error toggling WhatsApp account status:", error);
    return { success: false, error: "Failed to update account status" };
  }
}

export async function deleteWhatsAppAccount(accountId: string) {
  try {
    await prisma.whatsAppAccount.delete({ where: { id: accountId } });
    revalidatePath("/super-admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting WhatsApp account:", error);
    return { success: false, error: "Failed to delete account" };
  }
}
