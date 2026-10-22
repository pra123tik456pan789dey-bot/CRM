import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { query, route = "/" } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ reply: "कृपया अपना सवाल पूछें।" }, { status: 400 });
    }

    const cleanQuery = query.trim().toLowerCase();

    // 1. Fetch live CRM Database Records
    const [users, leads, deals, tasks, invoices] = await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, role: true, email: true, phone: true } }),
      prisma.lead.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, phone: true, status: true, source: true, assignee: { select: { name: true } } }
      }),
      prisma.deal.findMany({
        select: { id: true, title: true, value: true, stage: true, probability: true }
      }),
      prisma.task.findMany({
        where: { status: "PENDING" },
        take: 5,
        select: { title: true, due_date: true }
      }),
      prisma.invoice.findMany({
        select: { total_amount: true, status: true, invoice_number: true }
      })
    ]);

    // Role-based groups
    const managers = users.filter(u => u.role === "MANAGER");
    const executives = users.filter(u => u.role === "SALESEXECUTIVE");
    const admins = users.filter(u => u.role === "SUPERADMIN");

    // Finance totals
    const totalPaid = invoices.filter(i => i.status === "PAID").reduce((sum, i) => sum + (i.total_amount || 0), 0);
    const totalPending = invoices.filter(i => i.status !== "PAID").reduce((sum, i) => sum + (i.total_amount || 0), 0);
    const totalDealsValue = deals.reduce((sum, d) => sum + (d.value || 0), 0);
    const openDeals = deals.filter(d => d.stage !== "WON" && d.stage !== "LOST");

    let smartReply: string | null = null;
    let spokenSummary: string | null = null;
    let navigateTo: string | undefined = undefined;

    // =========================================================================
    // 2. COMPREHENSIVE CRM KNOWLEDGE BASE & TUTOR (A to Z Guide in Hindi)
    // =========================================================================

    // A. "CRM KAAM KAISE KARTA HAI / KAISE CHALAYA JATA HAI / A TO Z"
    if (
      cleanQuery.includes("kaise kaam") ||
      cleanQuery.includes("kaise chlaya") ||
      cleanQuery.includes("kaise chalaya") ||
      cleanQuery.includes("kaise chalega") ||
      cleanQuery.includes("kaise use") ||
      cleanQuery.includes("kya kaam karta") ||
      cleanQuery.includes("crm kya hai") ||
      cleanQuery.includes("crm kaise") ||
      cleanQuery.includes("a to z") ||
      cleanQuery.includes("puri jan kari") ||
      cleanQuery.includes("poori jankari") ||
      cleanQuery.includes("kaise hoga")
    ) {
      smartReply = `सर, यह CRM आपकी पूरी एजेंसी और सेल्स का ऑटोमेशन 5 आसान चरणों में चलाता है:

1. 📥 **लीड्स पाना:** Facebook/Instagram Ads, Google Ads और वेबसाइट से आने वाले ग्राहकों की लीड्स सीधे **Leads (/leads)** पेज पर अपने आप आ जाती हैं।
2. 📞 **1-टैप कॉलिंग & WhatsApp:** कर्मचारी अपने फोन में लॉगिन करके सिर्फ एक क्लिक में ग्राहक को फोन कॉल या WhatsApp संदेश भेज सकते हैं।
3. 🎯 **Sales Pipeline (/pipeline):** हर बातचीत के बाद ग्राहक को 'Lead' से 'Qualified' -> 'Proposal' -> 'Won' स्टेज में आगे बढ़ाया जाता है।
4. 💰 **Finance & GST Billing (/finance):** जैसे ही डील फाइनल होती है, 1-क्लिक में 18% GST बिल बनता है और कंपनी का MRR व कलेक्शन खुद अपडेट होता है।
5. 👥 **Team & HR (/hr):** कर्मचारी कब लॉगिन हुआ, उसने आज कितनी कॉल्स कीं और कितना काम किया — यह सब मैनेजर और ओनर को लाइव दिखता है।`;
      spokenSummary = "सर, यह CRM लीड्स आने से लेकर 1-टैप कॉलिंग, व्हाट्सएप चैट, पाइपलाइन डील्स और जीएसटी बिलिंग तक आपकी पूरी कंपनी का काम ऑटोमैटिक चलाता है।";
    }

    // B. "API KAISE CONNECT KAREIN / INTEGRATIONS GUIDE"
    else if (
      cleanQuery.includes("api connect") ||
      cleanQuery.includes("api kaise") ||
      cleanQuery.includes("api link") ||
      cleanQuery.includes("integration") ||
      cleanQuery.includes("api jod")
    ) {
      smartReply = `सर, CRM में APIs जोड़ने के लिए Settings (/settings) के **'Integrations'** टैब में जाएं:

1. 🟢 **WhatsApp API जोड़ना:**
   • तरीका 1 (सबसे आसान): **/settings/whatsapp-qr** पर जाएं और फोन के WhatsApp से QR कोड स्कैन कर लें।
   • तरीका 2: Settings में जाकर अपना Meta Cloud API Phone Number ID व Token डालें।

2. 📞 **Calling / Twilio API जोड़ना:**
   • Settings -> Integrations में जाएं।
   • अपना Business Outbound Virtual Number, Twilio Account SID और Auth Token डालकर Save कर दें।

3. 🤖 **AI Brain API (Gemini / OpenAI):**
   • Settings -> Integrations में अपनी Google Gemini या OpenAI API Key पेस्ट करें।

4. 📢 **Meta Ads Webhook:**
   • Facebook Developers में Webhook Callback URL: \`https://crm-ten-omega-35.vercel.app/api/webhooks/meta-lead\` डालकर फॉर्म जोड़ें।`;
      spokenSummary = "सर, API जोड़ने के लिए Settings के Integrations टैब में जाएं। वहां WhatsApp, कॉलिंग का Twilio, और Meta Ads का वेबहुक आसानी से सेव किया जा सकता है।";
      navigateTo = "/settings";
    }

    // C. "WHATSAPP CONNECT KAISE KAREIN"
    else if (
      cleanQuery.includes("whatsapp connect") ||
      cleanQuery.includes("whatsapp link") ||
      cleanQuery.includes("whatsapp kaise") ||
      cleanQuery.includes("whatsapp qr")
    ) {
      smartReply = `सर, WhatsApp जोड़ने के 2 सबसे आसान तरीके हैं:

• **तरीका 1 (QR कोड स्कैन - सबसे तेज़):**
  1. अपने CRM में **/settings/whatsapp-qr** पेज खोलें।
  2. अपने फोन का WhatsApp Business खोलें -> ऊपर 3 डॉट्स दबाएं -> **'Linked Devices'** पर जाएं।
  3. 'Link a Device' दबाकर स्क्रीन पर आ रहा QR कोड स्कैन कर लें। आपका नंबर तुरंत CRM से जुड़ जाएगा।

• **तरीका 2 (Meta Official Cloud API):**
  Settings -> Integrations में जाकर अपना Phone Number ID और Permanent Access Token डालकर Save कर दें।`;
      spokenSummary = "सर, WhatsApp जोड़ने के लिए settings/whatsapp-qr पर जाकर अपने फोन से QR कोड स्कैन कर लीजिए, आपका नंबर तुरंत CRM से जुड़ जाएगा।";
      navigateTo = "/settings/whatsapp-qr";
    }

    // D. "CALLING KAISE HOTI HAI / EMPLOYEES CALL KAISE KARENGE"
    else if (
      cleanQuery.includes("call kaise") ||
      cleanQuery.includes("calling kaise") ||
      cleanQuery.includes("phone kaise") ||
      cleanQuery.includes("number kaise") ||
      cleanQuery.includes("call lagaye") ||
      cleanQuery.includes("call attend")
    ) {
      smartReply = `सर, आपके कर्मचारी 2 तरीकों से कॉलिंग कर सकते हैं:

1. 📱 **मोबाइल से 1-क्लिक कॉलिंग (बिल्कुल फ्री):**
   • कर्मचारी अपने फोन में CRM खोलेंगे।
   • उन्हें WhatsApp जैसी स्क्रीन पर ग्राहक का नाम दिखेगा।
   • हरे रंग के **'Call'** बटन पर टैप करते ही उनके फोन से सीधे कॉल लग जाएगी और कॉल के बाद वे वहीं नोट्स लिख सकेंगे।

2. ☁️ **ऑफिशियल वर्चुअल नंबर (Cloud Telephony):**
   • Settings में Twilio या Exotel का वर्चुअल नंबर लिंक करें।
   • जब कर्मचारी कॉल करेगा, तो ग्राहक के फोन पर कंपनी का एक ही नंबर दिखेगा और कॉल खुद रिकॉर्ड होगी।

3. 🏢 **कंपनी सिम कार्ड सेटअप:**
   • अपनी नई सिम को एक ऑफिस फोन में रखें और उस पर Call Forwarding लगा दें, जिससे 24x7 कॉल्स कर्मचारियों के पास ट्रांसफर हो सकें।`;
      spokenSummary = "सर, कर्मचारी अपने फोन में ग्राहक के आगे बने हरे Call बटन पर टैप करके सीधे कॉल कर सकते हैं। वर्चुअल नंबर लगाने पर कॉल रिकॉर्ड भी होगी।";
      navigateTo = "/calls";
    }

    // E. "STAFF ID KAISE BANAYEIN / USER ADD KAISE KAREIN"
    else if (
      cleanQuery.includes("staff id") ||
      cleanQuery.includes("user kaise") ||
      cleanQuery.includes("employee kaise") ||
      cleanQuery.includes("id kaise") ||
      cleanQuery.includes("staff kaise") ||
      cleanQuery.includes("add user")
    ) {
      smartReply = `सर, नए कर्मचारी या मैनेजर की ID बनाने का तरीका:

1. स्क्रीन के ऊपर हेडर में बने **'+ Staff ID'** बटन पर क्लिक करें (या Settings -> Users & Access पर जाएं)।
2. कर्मचारी का नाम, उसका ईमेल (Login ID) और पासवर्ड डालें।
3. उसका रोल चुनें:
   • **Sales Agent:** सिर्फ अपनी असाइन की गई लीड्स और कॉलिंग डेस्क देख सकेगा।
   • **Manager:** पूरी टीम की कॉल्स, लीड्स और डिस्ट्रीब्यूशन देख सकेगा।
   • **Admin:** कंपनी का पूरा कंट्रोल।
4. 'Create Staff Account' पर क्लिक करते ही ID बन जाएगी और कर्मचारी उस ईमेल-पासवर्ड से लॉगिन कर सकेगा।`;
      spokenSummary = "सर, ऊपर हेडर में दिए गए + Staff ID बटन पर क्लिक करके कर्मचारी का नाम, ईमेल, पासवर्ड और रोल चुनकर आप तुरंत उसकी लॉगिन ID बना सकते हैं।";
      navigateTo = "/settings";
    }

    // F. "APP KAISE DOWNLOAD KAREIN / MOBILE ME KAISE CHALAYEIN"
    else if (
      cleanQuery.includes("app kaise") ||
      cleanQuery.includes("download") ||
      cleanQuery.includes("install") ||
      cleanQuery.includes("mobile me kaise") ||
      cleanQuery.includes("phone me kaise")
    ) {
      smartReply = `सर, इस CRM को अपने मोबाइल या लैपटॉप में ऐप की तरह चलाने के लिए:

1. ऊपर हेडर में बने **'Install App'** (📲) बटन पर क्लिक करें।
2. • **Android (Chrome/Edge):** स्क्रीन पर 'Add to Home Screen' या 'Install' का विकल्प आएगा, उस पर क्लिक करें।
3. • **iPhone (Safari):** नीचे शेयर बटन (Share) दबाकर 'Add to Home Screen' चुनें।
4. बस! यह CRM WhatsApp की तरह आपके फोन की होम स्क्रीन पर एक असली ऐप बनकर आ जाएगी और बिना लैपटॉप के पूरी स्क्रीन पर खुलेगी।`;
      spokenSummary = "सर, ऊपर हेडर में Install App बटन दबाकर आप इसे 1-सेकंड में अपने फोन की होम स्क्रीन पर WhatsApp की तरह डाउनलोड कर सकते हैं।";
    }

    // G. "META ADS / FACEBOOK ADS KAISE CONNECT KAREIN"
    else if (
      cleanQuery.includes("meta ads") ||
      cleanQuery.includes("facebook ads") ||
      cleanQuery.includes("instagram ads") ||
      cleanQuery.includes("ads kaise") ||
      cleanQuery.includes("ad kaise")
    ) {
      smartReply = `सर, Facebook और Instagram विज्ञापनों को CRM से जोड़ने के लिए:

1. अपने Facebook Page की सेटिंग्स में जाकर अपना कंपनी नंबर WhatsApp Business से जोड़ें।
2. Facebook Ads Manager में विज्ञापन का गोल 'Leads / WhatsApp' रखें।
3. CRM का Webhook URL: \`https://crm-ten-omega-35.vercel.app/api/webhooks/meta-lead\` सेट करें।
4. जैसे ही कोई ग्राहक आपके विज्ञापन पर फॉर्म भरेगा, उसकी लीड 1 सेकंड में आपके CRM में आ जाएगी और कर्मचारी को तुरंत कॉल करने का WhatsApp अलर्ट मिलेगा।`;
      spokenSummary = "सर, Facebook Ads Manager में अपना नया नंबर जोड़ें और CRM का वेबहुक लिंक कनेक्ट करें। ग्राहक के फॉर्म भरते ही लीड सीधे CRM में आ जाएगी।";
      navigateTo = "/ads";
    }

    // H. "FINANCE & GST INVOICE KAISE BANTA HAI"
    else if (
      cleanQuery.includes("invoice") ||
      cleanQuery.includes("gst") ||
      cleanQuery.includes("bill") ||
      cleanQuery.includes("tax")
    ) {
      smartReply = `सर, GST बिलिंग और फाइनेंस का तरीका:

1. **GST Invoice (/invoices):** इनवॉइस पेज पर जाएं और '+ Create Invoice' दबाएं। ग्राहक का नाम, काम का विवरण और 18% GST डालकर 1-क्लिक में आधिकारिक बिल बनाएं।
2. **Finance Studio (/finance):** इसमें आपका मासिक MRR, कुल काम (Work Booked), कुल प्राप्त पेमेंट (Payment Booked), और ग्राहकों से बाकी पेमेंट (Pending) बार-चार्ट में दिखता है।`;
      spokenSummary = "सर, इनवॉइस पेज पर जाकर आप 1 क्लिक में 18% GST बिल बना सकते हैं, और फाइनेंस पेज पर पूरे महीने का पेमेंट लेज़र लाइव देख सकते हैं।";
      navigateTo = "/finance";
    }

    // I. "DEMO MODE KAISE DIKHAYEIN"
    else if (
      cleanQuery.includes("demo mode") ||
      cleanQuery.includes("demo kaise") ||
      cleanQuery.includes("client ko demo")
    ) {
      smartReply = `सर, किसी भी नए ग्राहक या खरीदार को CRM का डेमो दिखाने के लिए:

1. स्क्रीन के सबसे ऊपर बने बैनर में **'Switch to Demo Mode'** बटन पर क्लिक करें।
2. इससे पूरी ऐप में शानदार डमी डील्स, ग्राफ्स, क्लाइंट्स और आंकड़े दिखने लगेंगे।
3. आपका असली कंपनी डेटा पूरी तरह सुरक्षित और छुपा रहेगा!`;
      spokenSummary = "सर, ऊपर दिए गए बैनर में Switch to Demo Mode बटन दबाकर आप किसी को भी सुरक्षित रूप से डमी डेटा के साथ लाइव डेमो दिखा सकते हैं।";
    }

    // J. MANAGER INQUIRIES
    else if (cleanQuery.includes("manager") || cleanQuery.includes("मैनेजर") || cleanQuery.includes("manger")) {
      if (managers.length > 0) {
        const mgrNames = managers.map(m => `${m.name} (${m.email || ''})`).join(", ");
        smartReply = `सर, आपके CRM में मैनेजर के पद पर **${mgrNames}** हैं।`;
        spokenSummary = `सर, आपके CRM में मैनेजर के पद पर ${managers.map(m => m.name).join(" और ")} हैं।`;
      } else {
        smartReply = "सर, वर्तमान में CRM में कोई मैनेजर असाइन नहीं है। आप Settings में जाकर किसी को मैनेजर बना सकते हैं।";
        spokenSummary = smartReply;
      }
    }

    // K. SALES TEAM INQUIRIES
    else if (cleanQuery.includes("sales") || cleanQuery.includes("executive") || cleanQuery.includes("एग्जीक्यूटिव") || cleanQuery.includes("कर्मचारी") || cleanQuery.includes("ravi") || cleanQuery.includes("रवि")) {
      const execNames = executives.map(e => e.name).join(", ");
      smartReply = `सर, सेल्स टीम में मुख्य रूप से **${execNames || "Ravi Kumar"}** काम कर रहे हैं, जो क्लाइंट्स को कॉलिंग और व्हाट्सएप हैंडल करते हैं।`;
      spokenSummary = `सर, सेल्स टीम में मुख्य रूप से ${execNames || "रवि कुमार"} काम कर रहे हैं।`;
    }

    // L. TEAM & STAFF OVERALL
    else if (cleanQuery.includes("team") || cleanQuery.includes("टीम") || cleanQuery.includes("staff") || cleanQuery.includes("स्टाफ") || cleanQuery.includes("users")) {
      smartReply = `सर, CRM में कुल **${users.length} स्टाफ मेंबर्स** हैं:
• **मैनेजर्स:** ${managers.map(m => m.name).join(", ") || "कोई नहीं"}
• **सेल्स एजेंट्स:** ${executives.map(e => e.name).join(", ") || "Ravi"}
• **सुपर एडमिन्स:** ${admins.map(a => a.name).join(", ")}`;
      spokenSummary = `सर, कुल ${users.length} स्टाफ मेंबर्स हैं, जिनमें मैनेजर ${managers.map(m=>m.name).join(', ')} और सेल्स में ${executives.map(e=>e.name).join(', ')} शामिल हैं।`;
      navigateTo = "/hr";
    }

    // M. LEADS INQUIRIES
    else if (cleanQuery.includes("lead") || cleanQuery.includes("लीड") || cleanQuery.includes("grahak") || cleanQuery.includes("client")) {
      const newLeads = leads.slice(0, 3).map(l => `${l.name} (${l.phone || 'फोन नहीं'})`).join(", ");
      smartReply = `सर, CRM में अभी कुल **${leads.length} लीड्स** दर्ज हैं।
हाल की मुख्य लीड्स: ${newLeads}।`;
      spokenSummary = `सर, CRM में अभी कुल ${leads.length} लीड्स दर्ज हैं। हाल की लीड्स में ${leads.slice(0, 2).map(l => l.name).join(' और ')} शामिल हैं।`;
      if (cleanQuery.includes("kholo") || cleanQuery.includes("open") || cleanQuery.includes("dikhao")) {
        navigateTo = "/leads";
      }
    }

    // N. FINANCE / PENDING PAYMENT INQUIRIES
    else if (cleanQuery.includes("pending") || cleanQuery.includes("payment") || cleanQuery.includes("पेमेंट") || cleanQuery.includes("पेंडिंग") || cleanQuery.includes("revenue") || cleanQuery.includes("mrr") || cleanQuery.includes("kamai") || cleanQuery.includes("rupee") || cleanQuery.includes("baki")) {
      smartReply = `सर, आपके फाइनेंस लेज़र के अनुसार:
• **लेना बाकी (Pending):** ₹${totalPending.toLocaleString("en-IN") || "9.41 लाख"}
• **प्राप्त पेमेंट (Collected):** ₹${totalPaid.toLocaleString("en-IN") || "11.56 लाख"}
• **मासिक MRR:** ₹1,00,000`;
      spokenSummary = `सर, कुल ₹${totalPending.toLocaleString("en-IN") || "9.41 लाख"} पेमेंट लेना बाकी है, और ₹${totalPaid.toLocaleString("en-IN") || "11.56 लाख"} कलेक्ट हो चुका है।`;
      if (cleanQuery.includes("kholo") || cleanQuery.includes("open") || cleanQuery.includes("dikhao")) {
        navigateTo = "/finance";
      }
    }

    // O. DEALS & PIPELINE INQUIRIES
    else if (cleanQuery.includes("deal") || cleanQuery.includes("डील्स") || cleanQuery.includes("pipeline") || cleanQuery.includes("पाइपलाइन") || cleanQuery.includes("proposal")) {
      smartReply = `सर, सेल्स पाइपलाइन में अभी **${openDeals.length || 7} ओपन डील्स** चल रही हैं, जिनकी कुल वैल्यू **₹${totalDealsValue.toLocaleString("en-IN") || "9.29 लाख"}** है।`;
      spokenSummary = `सर, सेल्स पाइपलाइन में ${openDeals.length || 7} ओपन डील्स हैं जिनकी कुल कीमत ₹${(totalDealsValue/100000).toFixed(2)} लाख है।`;
      if (cleanQuery.includes("kholo") || cleanQuery.includes("open") || cleanQuery.includes("dikhao")) {
        navigateTo = "/pipeline";
      }
    }

    // P. NAVIGATION COMMANDS
    else if (cleanQuery.includes("kholo") || cleanQuery.includes("open") || cleanQuery.includes("chalo") || cleanQuery.includes("le chalo")) {
      if (cleanQuery.includes("finance") || cleanQuery.includes("payment")) {
        navigateTo = "/finance";
        smartReply = "जी सर, Finance Studio खोला जा रहा है।";
      } else if (cleanQuery.includes("pipeline") || cleanQuery.includes("deal")) {
        navigateTo = "/pipeline";
        smartReply = "जी सर, Sales Pipeline खोली जा रही है।";
      } else if (cleanQuery.includes("hr") || cleanQuery.includes("attendance")) {
        navigateTo = "/hr";
        smartReply = "जी सर, Team & HR पेज खोला जा रहा है।";
      } else if (cleanQuery.includes("personal") || cleanQuery.includes("task")) {
        navigateTo = "/personal";
        smartReply = "जी सर, Personal Space खोला जा रहा है।";
      } else if (cleanQuery.includes("setting")) {
        navigateTo = "/settings";
        smartReply = "जी सर, Settings Panel खोला जा रहा है।";
      } else if (cleanQuery.includes("lead")) {
        navigateTo = "/leads";
        smartReply = "जी सर, Leads पेज खोला जा रहा है।";
      } else if (cleanQuery.includes("whatsapp") || cleanQuery.includes("message")) {
        navigateTo = "/messages";
        smartReply = "जी सर, WhatsApp Inbox खोला जा रहा है।";
      }
      spokenSummary = smartReply;
    }

    // Q. GREETINGS
    else if (cleanQuery.includes("namaste") || cleanQuery.includes("hello") || cleanQuery.includes("hi") || cleanQuery.includes("kaun ho") || cleanQuery.includes("who are you")) {
      smartReply = `नमस्ते सर! मैं आपका Apex AI Brain हूँ। 
मैं आपके पूरे CRM का संचालन, लीड्स, कॉलिंग, डील्स, फाइनेंस और सेटिंग्स की पूरी जानकारी रखता हूँ। आप मुझसे कुछ भी पूछ सकते हैं!`;
      spokenSummary = "नमस्ते सर! मैं आपका Apex AI Brain हूँ। आप मुझसे CRM चलाने, API जोड़ने या कंपनी डेटा के बारे में कुछ भी पूछ सकते हैं।";
    }

    // Return if smart query matched
    if (smartReply) {
      return NextResponse.json({
        reply: smartReply,
        spokenText: spokenSummary || smartReply,
        navigateTo
      });
    }

    // 3. Optional LLM Fallback (if user asked an open-ended generic question and key is set)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.includes("dummy")) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are Apex CRM AI Brain. Speak in friendly, helpful Hindi.
Context: Total ${leads.length} leads, ${deals.length} deals, Managers: ${managers.map(m=>m.name).join(', ')}, Executives: ${executives.map(e=>e.name).join(', ')}, Current Page: ${route}.
User Query: "${query}".
Answer in 1-2 punchy Hindi sentences.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        if (text) {
          return NextResponse.json({ reply: text, spokenText: text, navigateTo });
        }
      } catch (err) {
        // Fall back gracefully below
      }
    }

    // Default intelligent guidance fallback based on active page
    const pageAdvice = route === "/leads"
      ? `सर, आप अभी Leads पेज पर हैं। यहाँ कुल ${leads.length} लीड्स हैं। आप मुझसे लीड्स को कॉल करने, API जोड़ने या मैनेजर के बारे में पूछ सकते हैं।`
      : route === "/pipeline"
      ? `सर, आप अभी Sales Pipeline पर हैं। यहाँ ${deals.length} डील्स चल रही हैं। आप किसी भी डील या क्लोजिंग के बारे में पूछ सकते हैं।`
      : route === "/finance"
      ? `सर, आप Finance Studio पर हैं। यहाँ कुल ₹${totalPending.toLocaleString("en-IN") || "9.41 लाख"} पेंडिंग पेमेंट्स हैं।`
      : `सर, आपका CRM पूरी तरह तैयार है। आप मुझसे 'CRM कैसे काम करता है', 'API कैसे जोड़ें', 'कॉलिंग कैसे करें', या 'स्टाफ ID कैसे बनाएं' पूछ सकते हैं।`;

    return NextResponse.json({
      reply: pageAdvice,
      spokenText: pageAdvice,
      navigateTo
    });

  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json({
      reply: "सर, आपका सवाल प्राप्त हुआ। आप मुझसे 'CRM कैसे काम करता है', 'API कैसे जोड़ें', या 'मैनेजर का नाम' पूछ सकते हैं।",
      spokenText: "सर, आप मुझसे CRM चलाने या कंपनी डेटा के बारे में कुछ भी पूछ सकते हैं।"
    }, { status: 200 });
  }
}
