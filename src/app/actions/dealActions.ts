"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDealsWithPipeline() {
  try {
    const pipeline = await prisma.pipeline.findFirst({
      include: {
        stages: {
          orderBy: { order_index: "asc" }
        }
      }
    });

    const deals = await prisma.deal.findMany({
      include: {
        contact: true,
        assignee: true,
        stageRelation: true
      },
      orderBy: { updatedAt: "desc" }
    });

    return { pipeline, deals };
  } catch (error) {
    console.error("Error fetching deals:", error);
    return { pipeline: null, deals: [] };
  }
}

export async function updateDealStage(dealId: string, stageId: string, stageName: string) {
  try {
    const deal = await prisma.deal.update({
      where: { id: dealId },
      data: {
        stage_id: stageId,
        stage: stageName,
        probability: stageName === "Closed Won" || stageName === "WON" ? 100 : stageName === "Closed Lost" || stageName === "LOST" ? 0 : 60
      },
      include: { contact: true }
    });

    // Update lead status as well if matching
    if (deal.contact_id) {
      await prisma.lead.update({
        where: { id: deal.contact_id },
        data: { status: stageName }
      });

      await prisma.activity.create({
        data: {
          contact_id: deal.contact_id,
          type: "STATUS_CHANGE",
          content: `Deal "${deal.title}" moved to ${stageName}`
        }
      });
    }

    revalidatePath("/leads");
    revalidatePath("/deals");
    return { success: true, deal };
  } catch (error) {
    console.error("Error updating deal stage:", error);
    return { success: false, error: "Failed to update deal stage" };
  }
}

export async function createDeal(data: {
  contact_id: string;
  title: string;
  value: number;
  expected_close_date?: string;
  assigned_to?: string;
}) {
  try {
    const pipeline = await prisma.pipeline.findFirst({
      include: { stages: { orderBy: { order_index: "asc" } } }
    });

    const defaultStage = pipeline?.stages[0];

    const deal = await prisma.deal.create({
      data: {
        contact_id: data.contact_id,
        pipeline_id: pipeline?.id || null,
        stage_id: defaultStage?.id || null,
        title: data.title,
        value: data.value,
        currency: "INR",
        stage: defaultStage?.name || "New Lead",
        expected_close_date: data.expected_close_date ? new Date(data.expected_close_date) : null,
        assigned_to: data.assigned_to || null
      }
    });

    revalidatePath("/leads");
    revalidatePath("/deals");
    return { success: true, deal };
  } catch (error) {
    console.error("Error creating deal:", error);
    return { success: false, error: "Failed to create deal" };
  }
}
