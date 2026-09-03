"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignee: true,
        deals: true,
        tasks: { where: { status: "PENDING" } }
      }
    });
    return leads;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
}

export async function getLeadById(id: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignee: true,
        deals: { include: { stageRelation: true } },
        tasks: { orderBy: { due_date: "asc" } },
        activities: { include: { agent: true }, orderBy: { timestamp: "desc" } },
        messages: { orderBy: { timestamp: "asc" } },
        callLogs: { include: { agent: true }, orderBy: { timestamp: "desc" } }
      }
    });
    return lead;
  } catch (error) {
    console.error("Error fetching lead by id:", error);
    return null;
  }
}

export async function createLead(data: {
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  address?: string;
  source?: string;
  status?: string;
  tags?: string;
  assigned_to?: string;
}) {
  try {
    const company = await prisma.company.findFirst();
    const newLead = await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        company_name: data.company_name || null,
        address: data.address || null,
        source: data.source || "MANUAL",
        status: data.status || "NEW",
        tags: data.tags || null,
        assigned_to: data.assigned_to || null,
        company_id: company?.id || null
      }
    });

    // Create initial activity log
    await prisma.activity.create({
      data: {
        contact_id: newLead.id,
        type: "STATUS_CHANGE",
        content: `Lead created from source: ${newLead.source}`
      }
    });

    revalidatePath("/leads");
    return { success: true, lead: newLead };
  } catch (error) {
    console.error("Error creating lead:", error);
    return { success: false, error: "Failed to create lead" };
  }
}

export async function updateLeadStatus(leadId: string, newStatus: string) {
  try {
    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { status: newStatus }
    });

    await prisma.activity.create({
      data: {
        contact_id: leadId,
        type: "STATUS_CHANGE",
        content: `Lead status updated to ${newStatus}`
      }
    });

    revalidatePath("/leads");
    revalidatePath(`/leads/${leadId}`);
    return { success: true, lead };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function addLeadNote(leadId: string, content: string, agentId?: string) {
  try {
    const activity = await prisma.activity.create({
      data: {
        contact_id: leadId,
        agent_id: agentId || null,
        type: "NOTE",
        content
      }
    });

    revalidatePath(`/leads/${leadId}`);
    return { success: true, activity };
  } catch (error) {
    console.error("Error adding lead note:", error);
    return { success: false, error: "Failed to add note" };
  }
}

export async function getDashboardStats() {
  try {
    const totalLeads = await prisma.lead.count();
    const wonLeads = await prisma.lead.count({ where: { status: "WON" } });
    const totalMessages = await prisma.whatsAppMessage.count();
    const totalCalls = await prisma.callLog.count();
    
    // Revenue pipeline
    const deals = await prisma.deal.findMany({ select: { value: true, stage: true } });
    const totalPipelineValue = deals.reduce((acc, deal) => acc + (deal.value || 0), 0);
    const totalWonRevenue = deals
      .filter((d) => d.stage === "WON" || d.stage === "Closed Won")
      .reduce((acc, deal) => acc + (deal.value || 0), 0);

    const recentActivities = await prisma.activity.findMany({
      take: 6,
      orderBy: { timestamp: "desc" },
      include: { contact: true, agent: true }
    });

    const leadSourceBreakdown = await prisma.lead.groupBy({
      by: ["source"],
      _count: { source: true }
    });

    const leadStatusBreakdown = await prisma.lead.groupBy({
      by: ["status"],
      _count: { status: true }
    });

    return {
      totalLeads,
      wonLeads,
      totalMessages,
      totalCalls,
      totalPipelineValue,
      totalWonRevenue,
      recentActivities,
      leadSourceBreakdown,
      leadStatusBreakdown
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalLeads: 0,
      wonLeads: 0,
      totalMessages: 0,
      totalCalls: 0,
      totalPipelineValue: 0,
      totalWonRevenue: 0,
      recentActivities: [],
      leadSourceBreakdown: [],
      leadStatusBreakdown: []
    };
  }
}
