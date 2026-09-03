"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        contact: true,
        deal: true,
        assignee: true
      },
      orderBy: { due_date: "asc" }
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function createTask(data: {
  contact_id?: string;
  deal_id?: string;
  title: string;
  description?: string;
  due_date: string;
  priority?: string;
  assigned_to?: string;
}) {
  try {
    const task = await prisma.task.create({
      data: {
        contact_id: data.contact_id || null,
        deal_id: data.deal_id || null,
        title: data.title,
        description: data.description || null,
        due_date: new Date(data.due_date),
        priority: data.priority || "MEDIUM",
        status: "PENDING",
        assigned_to: data.assigned_to || null
      }
    });

    if (data.contact_id) {
      await prisma.activity.create({
        data: {
          contact_id: data.contact_id,
          type: "NOTE",
          content: `Task created: "${data.title}" (Due: ${new Date(data.due_date).toLocaleDateString()})`
        }
      });
      revalidatePath(`/leads/${data.contact_id}`);
    }

    revalidatePath("/tasks");
    return { success: true, task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function toggleTaskStatus(taskId: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });

    revalidatePath("/tasks");
    if (task.contact_id) revalidatePath(`/leads/${task.contact_id}`);
    return { success: true, task };
  } catch (error) {
    console.error("Error toggling task status:", error);
    return { success: false, error: "Failed to update task status" };
  }
}
