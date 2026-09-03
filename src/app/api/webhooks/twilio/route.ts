import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const callSid = formData.get("CallSid")?.toString();
    const fromNumber = formData.get("From")?.toString();
    const toNumber = formData.get("To")?.toString();
    const callStatus = formData.get("CallStatus")?.toString(); // completed, busy, no-answer, failed
    const recordingUrl = formData.get("RecordingUrl")?.toString();
    const duration = parseInt(formData.get("CallDuration")?.toString() || "0", 10);

    if (fromNumber) {
      let lead = await prisma.lead.findFirst({
        where: { phone: { contains: fromNumber.replace("+", "") } }
      });

      // Missed Call to Lead Auto-Creation
      if (!lead && (callStatus === "no-answer" || callStatus === "busy" || callStatus === "completed")) {
        const company = await prisma.company.findFirst();
        lead = await prisma.lead.create({
          data: {
            name: `Missed Call (${fromNumber})`,
            phone: fromNumber,
            source: "COLD_CALL",
            status: "NEW",
            company_id: company?.id || null
          }
        });

        await prisma.activity.create({
          data: {
            contact_id: lead.id,
            type: "STATUS_CHANGE",
            content: `Auto-created lead from incoming telephony call.`
          }
        });
      }

      if (lead) {
        const callLog = await prisma.callLog.create({
          data: {
            contact_id: lead.id,
            direction: "INBOUND",
            from_number: fromNumber,
            to_number: toNumber || null,
            duration_seconds: duration,
            status: callStatus?.toUpperCase() || "COMPLETED",
            recording_url: recordingUrl || null
          }
        });

        await prisma.activity.create({
          data: {
            contact_id: lead.id,
            type: "CALL",
            content: `Incoming Call (${callStatus}) - Duration: ${duration}s`,
            metadata: JSON.stringify({ recording_url: recordingUrl, duration, callSid })
          }
        });
      }
    }

    // Return TwiML response for Twilio
    return new NextResponse(
      `<Response><Say>Thank you for calling. Your call has been logged into our CRM.</Say></Response>`,
      { headers: { "Content-Type": "text/xml" } }
    );
  } catch (error) {
    console.error("Error handling Twilio webhook:", error);
    return new NextResponse("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
  }
}
