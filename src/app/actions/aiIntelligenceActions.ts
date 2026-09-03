"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAIIntelligenceSummary() {
  try {
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        name: true,
        company_name: true,
        status: true,
        ai_score: true,
        sentiment: true,
        source: true
      },
      orderBy: { ai_score: "desc" }
    });

    const highIntentLeads = leads.filter((l) => l.ai_score >= 80);
    const avgScore = leads.length > 0 ? Math.round(leads.reduce((a, b) => a + b.ai_score, 0) / leads.length) : 75;

    const positiveCount = leads.filter((l) => l.sentiment === "POSITIVE").length;
    const neutralCount = leads.filter((l) => l.sentiment === "NEUTRAL").length;
    const negativeCount = leads.filter((l) => l.sentiment === "NEGATIVE").length;

    return {
      totalLeads: leads.length,
      highIntentCount: highIntentLeads.length,
      avgScore,
      leads,
      sentimentDistribution: { positive: positiveCount, neutral: neutralCount, negative: negativeCount }
    };
  } catch (error) {
    console.error("Error fetching AI intelligence summary:", error);
    return {
      totalLeads: 0,
      highIntentCount: 0,
      avgScore: 0,
      leads: [],
      sentimentDistribution: { positive: 0, neutral: 0, negative: 0 }
    };
  }
}

export async function recalculateLeadScore(leadId: string) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { deals: true, messages: true, callLogs: true }
    });

    if (!lead) return { success: false, error: "Lead not found" };

    let score = 50;
    if (lead.status === "PROPOSAL") score += 25;
    if (lead.status === "QUALIFIED") score += 15;
    if (lead.status === "WON") score = 100;
    if (lead.messages.length > 2) score += 10;
    if (lead.callLogs.length > 0) score += 10;

    score = Math.min(100, Math.max(0, score));

    await prisma.lead.update({
      where: { id: leadId },
      data: { ai_score: score }
    });

    revalidatePath("/leads");
    revalidatePath(`/leads/${leadId}`);
    return { success: true, newScore: score };
  } catch (error) {
    console.error("Error recalculating AI score:", error);
    return { success: false, error: "Failed to recalculate score" };
  }
}
