"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getWorkflowRules() {
  try {
    const rules = await prisma.workflowRule.findMany({
      orderBy: { createdAt: "desc" }
    });
    return rules;
  } catch (error) {
    console.error("Error fetching workflow rules:", error);
    return [];
  }
}

export async function createWorkflowRule(data: {
  name: string;
  trigger_event: string;
  action_type: string;
  action_config: string;
}) {
  try {
    const company = await prisma.company.findFirst();
    const rule = await prisma.workflowRule.create({
      data: {
        company_id: company?.id || null,
        name: data.name,
        trigger_event: data.trigger_event,
        action_type: data.action_type,
        action_config: data.action_config,
        is_active: true
      }
    });

    revalidatePath("/automations");
    return { success: true, rule };
  } catch (error) {
    console.error("Error creating workflow rule:", error);
    return { success: false, error: "Failed to create automation rule" };
  }
}

export async function toggleWorkflowStatus(ruleId: string, currentActive: boolean) {
  try {
    const rule = await prisma.workflowRule.update({
      where: { id: ruleId },
      data: { is_active: !currentActive }
    });

    revalidatePath("/automations");
    return { success: true, rule };
  } catch (error) {
    console.error("Error toggling workflow rule status:", error);
    return { success: false, error: "Failed to update workflow status" };
  }
}
