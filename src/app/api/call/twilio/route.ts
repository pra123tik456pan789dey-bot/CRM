import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { leadId, agentId } = await req.json();

    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    const agent = agentId ? await prisma.user.findUnique({ where: { id: agentId } }) : null;

    if (!lead || !lead.phone) {
      return NextResponse.json({ error: "Invalid lead or agent information" }, { status: 400 });
    }

    const callSessionId = `call_sid_${Date.now()}`;

    const interaction = await prisma.activity.create({
      data: {
        contact_id: lead.id,
        agent_id: agent?.id || null,
        type: "CALL",
        content: `Call initiated. Session ID: ${callSessionId}`
      }
    });

    return NextResponse.json({ status: "Calling", callId: callSessionId, logId: interaction.id }, { status: 200 });
  } catch (error) {
    console.error("Click to Call Error:", error);
    return NextResponse.json({ error: "Failed to initiate call" }, { status: 500 });
  }
}
