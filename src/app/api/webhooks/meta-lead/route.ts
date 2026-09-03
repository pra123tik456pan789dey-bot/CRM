import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object !== "page") {
      return NextResponse.json({ error: "Invalid object type" }, { status: 400 });
    }

    const defaultCompany = await prisma.company.findFirst();
    const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;

    for (const entry of body.entry || []) {
      const facebookPageId = entry.id || null; // 50 Facebook Pages Tracking

      for (const change of entry.changes || []) {
        if (change.field === "leadgen") {
          const leadgenId = change.value?.leadgen_id;
          const adId = change.value?.ad_id || null;
          const campaignId = change.value?.form_id || null;

          let fetchedLead = {
            name: "Meta Ad Lead",
            email: "meta-lead@example.com",
            phone: "+919876543210",
          };

          // Fetch real lead data from Meta Graph API if access token is configured
          if (leadgenId && pageAccessToken) {
            try {
              const graphRes = await fetch(
                `https://graph.facebook.com/v19.0/${leadgenId}?access_token=${pageAccessToken}`
              );
              if (graphRes.ok) {
                const graphData = await graphRes.json();
                const fieldData = graphData.field_data || [];
                let name = "", email = "", phone = "";

                fieldData.forEach((field: any) => {
                  if (field.name === "full_name" || field.name === "name") {
                    name = field.values?.[0] || name;
                  }
                  if (field.name === "email") {
                    email = field.values?.[0] || email;
                  }
                  if (field.name === "phone_number" || field.name === "phone") {
                    phone = field.values?.[0] || phone;
                  }
                });

                if (name || email || phone) {
                  fetchedLead = {
                    name: name || "Meta Lead",
                    email: email || "meta-lead@example.com",
                    phone: phone || "+919876543210",
                  };
                }
              }
            } catch (err) {
              console.error("Error fetching lead from Graph API:", err);
            }
          }

          // Smart Round-Robin Assignment across 50 active Sales Executives
          const salesExecs = await prisma.user.findMany({
            where: { role: "SALESEXECUTIVE" },
            orderBy: { createdAt: "asc" },
          });

          let assignedTo: string | null = null;
          if (salesExecs.length > 0) {
            // Count total leads to cycle index
            const totalLeadsCount = await prisma.lead.count();
            const nextIndex = totalLeadsCount % salesExecs.length;
            assignedTo = salesExecs[nextIndex].id;
          }

          const lead = await prisma.lead.create({
            data: {
              company_id: defaultCompany?.id || null,
              name: fetchedLead.name,
              email: fetchedLead.email,
              phone: fetchedLead.phone,
              source: "FACEBOOK",
              status: "NEW",
              assigned_to: assignedTo,
              facebook_page_id: facebookPageId,
              facebook_ad_id: adId,
              facebook_campaign_id: campaignId,
            },
          });

          const assignedUser = salesExecs.find((u) => u.id === assignedTo);

          await prisma.activity.create({
            data: {
              contact_id: lead.id,
              type: "STATUS_CHANGE",
              content: `Auto-captured from Facebook Page (ID: ${facebookPageId || "Default"}). Assigned via Round-Robin to ${assignedUser?.name || "Unassigned"}.`,
            },
          });
        }
      }
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Meta Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_VERIFY_TOKEN || "crm_verify_token_123";

  if (mode === "subscribe" && token === verifyToken) {
    console.log("META_LEAD_WEBHOOK_VERIFIED");
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}
