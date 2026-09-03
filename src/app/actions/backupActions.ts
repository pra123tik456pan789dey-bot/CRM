"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createManualDatabaseBackup() {
  try {
    const leads = await prisma.lead.findMany({ include: { deals: true, tasks: true } });
    const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
    const callLogs = await prisma.callLog.findMany();
    const whatsappMessages = await prisma.whatsAppMessage.findMany();
    const invoices = await prisma.invoice.findMany({ include: { items: true } });
    const tickets = await prisma.ticket.findMany();
    const workflowRules = await prisma.workflowRule.findMany();
    const whatsappAccounts = await prisma.whatsAppAccount.findMany();

    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      counts: {
        leads: leads.length,
        users: users.length,
        callLogs: callLogs.length,
        whatsappMessages: whatsappMessages.length,
        invoices: invoices.length,
        tickets: tickets.length,
        workflows: workflowRules.length,
        whatsappAccounts: whatsappAccounts.length,
      },
      data: {
        leads,
        users,
        callLogs,
        whatsappMessages,
        invoices,
        tickets,
        workflowRules,
        whatsappAccounts,
      },
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const fileSize = Buffer.byteLength(jsonString, "utf8");
    const filename = `crm_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

    // Save record to DB
    const backupRecord = await prisma.databaseBackup.create({
      data: {
        filename,
        file_size: fileSize,
        backup_type: "MANUAL",
        download_url: `data:application/json;base64,${Buffer.from(jsonString).toString("base64")}`,
      },
    });

    revalidatePath("/super-admin");
    return { success: true, backup: backupRecord, jsonString };
  } catch (error: any) {
    console.error("Error creating database backup:", error);
    return { success: false, error: error.message || "Failed to generate backup" };
  }
}

export async function getBackupHistory() {
  try {
    const backups = await prisma.databaseBackup.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return backups;
  } catch (error) {
    console.error("Error fetching backup history:", error);
    return [];
  }
}

export async function getSystemHealthStats() {
  try {
    const totalLeads = await prisma.lead.count();
    const totalCallLogs = await prisma.callLog.count();
    const totalMessages = await prisma.whatsAppMessage.count();
    const activeWhatsAppAccounts = await prisma.whatsAppAccount.count({ where: { status: "CONNECTED" } });
    const totalUsers = await prisma.user.count();

    const lastBackup = await prisma.databaseBackup.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return {
      status: "HEALTHY",
      totalLeads,
      totalCallLogs,
      totalMessages,
      activeWhatsAppAccounts,
      totalUsers,
      lastBackupAt: lastBackup ? lastBackup.createdAt : null,
      cloudDatabaseProvider: "PostgreSQL Ready (Prisma Client 5.22)",
    };
  } catch (error) {
    console.error("Error fetching health stats:", error);
    return {
      status: "ERROR",
      totalLeads: 0,
      totalCallLogs: 0,
      totalMessages: 0,
      activeWhatsAppAccounts: 0,
      totalUsers: 0,
      lastBackupAt: null,
      cloudDatabaseProvider: "Unknown",
    };
  }
}
