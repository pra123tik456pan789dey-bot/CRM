import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { query, route = "/" } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ reply: "Please ask a question or give a command." }, { status: 400 });
    }

    // 1. Gather live CRM database context
    let liveContext = "";
    try {
      const [leadsCount, recentLeads, deals, pendingTasks, users, invoices] = await Promise.all([
        prisma.lead.count(),
        prisma.lead.findMany({ take: 6, orderBy: { createdAt: "desc" }, select: { name: true, phone: true, status: true } }),
        prisma.deal.findMany({ select: { title: true, value: true, stage: true } }),
        prisma.task.count({ where: { status: "PENDING" } }),
        prisma.user.findMany({ select: { name: true, role: true, email: true } }),
        prisma.invoice.findMany({ select: { total_amount: true, status: true } })
      ]);

      const totalDealValue = deals.reduce((acc, d) => acc + (d.value || 0), 0);
      const pendingInvoiceSum = invoices.filter(i => i.status !== "PAID").reduce((acc, i) => acc + (i.total_amount || 0), 0);
      const paidInvoiceSum = invoices.filter(i => i.status === "PAID").reduce((acc, i) => acc + (i.total_amount || 0), 0);

      liveContext = `
=== CURRENT LIVE CRM DATABASE SNAPSHOT ===
- Current Active Page/Route: "${route}"
- Total Leads: ${leadsCount}
- Recent Leads: ${recentLeads.map(l => `${l.name} (${l.status}, Ph: ${l.phone || 'N/A'})`).join("; ")}
- Active Deals: ${deals.length} deals totaling ₹${totalDealValue.toLocaleString("en-IN")} (Sample: ${deals.slice(0, 4).map(d => `${d.title}: ₹${d.value} at ${d.stage}`).join("; ")})
- Pending Tasks: ${pendingTasks}
- Team Staff: ${users.map(u => `${u.name} [${u.role}]`).join(", ")}
- Invoices: Paid ₹${paidInvoiceSum.toLocaleString("en-IN")}, Pending to collect ₹${pendingInvoiceSum.toLocaleString("en-IN")}
`;
    } catch (dbErr) {
      console.warn("Could not fetch full DB context for AI assistant:", dbErr);
      liveContext = `Current page is: ${route}`;
    }

    // 2. Identify Quick Navigation intents
    const lowerQuery = query.toLowerCase();
    let navigateTo: string | undefined = undefined;

    if (lowerQuery.includes("lead") || lowerQuery.includes("लीड") || lowerQuery.includes("leads kholo")) {
      navigateTo = "/leads";
    } else if (lowerQuery.includes("pipeline") || lowerQuery.includes("पाइपलाइन") || lowerQuery.includes("deals")) {
      navigateTo = "/pipeline";
    } else if (lowerQuery.includes("finance") || lowerQuery.includes("वित्त") || lowerQuery.includes("mrr") || lowerQuery.includes("kamai") || lowerQuery.includes("payment")) {
      navigateTo = "/finance";
    } else if (lowerQuery.includes("personal") || lowerQuery.includes("पर्सनल") || lowerQuery.includes("task") || lowerQuery.includes("habit")) {
      navigateTo = "/personal";
    } else if (lowerQuery.includes("hr") || lowerQuery.includes("attendance") || lowerQuery.includes("leave") || lowerQuery.includes("staff")) {
      navigateTo = "/hr";
    } else if (lowerQuery.includes("setting") || lowerQuery.includes("सेटिंग")) {
      navigateTo = "/settings";
    } else if (lowerQuery.includes("whatsapp") || lowerQuery.includes("व्हाट्सएप") || lowerQuery.includes("chat")) {
      navigateTo = "/messages";
    } else if (lowerQuery.includes("call") || lowerQuery.includes("कॉल")) {
      navigateTo = "/calls";
    }

    // 3. Ask Gemini with full context
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({
        reply: `AI Voice Assistant is active. Based on your CRM, you have ${route} open. Please configure GEMINI_API_KEY in .env for full conversational answers.`,
        navigateTo
      });
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    // Use gemini-2.5-flash or gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are "Apex AI Brain" - the intelligent, voice-enabled CRM operating system companion (inspired by Zepfly OS).
You are speaking directly to the business owner or sales executive through a voice interface and on-screen cards.

Context:
${liveContext}

User Query: "${query}"

Guidelines:
1. Speak warmly, concisely, and directly in 1 to 3 clear sentences.
2. If the user spoke in Hindi or Hinglish, answer in conversational Hindi/Hinglish (Devanagari or Hinglish based on what feels most natural).
3. If they ask about numbers (revenue, pending payments, deals, leads, team), use the EXACT numbers from the CRM snapshot above.
4. If they give a navigation command (e.g. "open leads"), confirm warmly that you are taking them there.
5. Keep it punchy so it sounds natural when spoken aloud via text-to-speech. Do not include markdown asterisks or bullet lists if not necessary.`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text().trim();

    return NextResponse.json({
      reply: responseText,
      navigateTo
    });

  } catch (error: any) {
    console.error("AI Voice Assistant Error:", error);
    return NextResponse.json({
      reply: "माफ़ कीजिये, AI को डेटा लोड करने में कुछ परेशानी हुई। कृपया दोबारा पूछें।"
    }, { status: 500 });
  }
}
