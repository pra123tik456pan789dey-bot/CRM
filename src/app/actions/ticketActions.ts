"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        contact: true,
        assignee: true
      },
      orderBy: { createdAt: "desc" }
    });
    return tickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
}

export async function createTicket(data: {
  contact_id: string;
  subject: string;
  description?: string;
  priority?: string;
  assigned_to?: string;
}) {
  try {
    const company = await prisma.company.findFirst();
    const ticketNumber = `TICK-${Math.floor(Math.random() * 9000 + 1000)}`;

    const ticket = await prisma.ticket.create({
      data: {
        company_id: company?.id || null,
        contact_id: data.contact_id,
        ticket_number: ticketNumber,
        subject: data.subject,
        description: data.description || null,
        priority: data.priority || "MEDIUM",
        status: "OPEN",
        sla_due_at: new Date(Date.now() + 3600000 * 4), // 4 Hours SLA
        assigned_to: data.assigned_to || null
      }
    });

    await prisma.activity.create({
      data: {
        contact_id: data.contact_id,
        type: "TICKET",
        content: `Support Ticket ${ticketNumber} opened: "${data.subject}"`
      }
    });

    revalidatePath("/tickets");
    revalidatePath(`/leads/${data.contact_id}`);
    return { success: true, ticket };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return { success: false, error: "Failed to create support ticket" };
  }
}

export async function updateTicketStatus(ticketId: string, newStatus: string) {
  try {
    const ticket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus }
    });

    revalidatePath("/tickets");
    if (ticket.contact_id) revalidatePath(`/leads/${ticket.contact_id}`);
    return { success: true, ticket };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, error: "Failed to update ticket status" };
  }
}
