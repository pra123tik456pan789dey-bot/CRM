const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  if (prisma.invoiceItem) await prisma.invoiceItem.deleteMany({});
  if (prisma.invoice) await prisma.invoice.deleteMany({});
  if (prisma.ticket) await prisma.ticket.deleteMany({});
  if (prisma.workflowRule) await prisma.workflowRule.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.whatsAppMessage.deleteMany({});
  await prisma.callLog.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.pipelineStage.deleteMany({});
  await prisma.pipeline.deleteMany({});
  await prisma.whatsAppAccount.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.team.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.adsCampaign.deleteMany({});

  console.log('Seeding Enterprise CRM fresh data...');

  // 1. Create Company
  const company = await prisma.company.create({
    data: {
      name: 'Apex Global Technologies',
      logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
      theme_color: '#4F46E5',
      subscription_plan: 'ENTERPRISE'
    }
  });

  // 2. Create Team
  const team = await prisma.team.create({
    data: { name: 'Enterprise Sales Team', company_id: company.id }
  });

  // 3. Create Users
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Amit Sharma',
      email: 'admin@crm.com',
      password_hash: hashedPassword,
      role: 'SUPERADMIN',
      company_id: company.id,
      team_id: team.id,
      phone: '+919876543210'
    }
  });

  const manager = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@crm.com',
      password_hash: hashedPassword,
      role: 'MANAGER',
      company_id: company.id,
      team_id: team.id,
      phone: '+919876543211'
    }
  });

  const salesRep = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul@crm.com',
      password_hash: hashedPassword,
      role: 'SALESEXECUTIVE',
      company_id: company.id,
      team_id: team.id,
      phone: '+919876543212'
    }
  });

  // 4. Create Pipeline & Stages
  const pipeline = await prisma.pipeline.create({
    data: {
      name: 'Standard Sales Pipeline',
      company_id: company.id,
      stages: {
        create: [
          { name: 'New Lead', order_index: 0, color: 'bg-blue-100 text-blue-800' },
          { name: 'Contacted', order_index: 1, color: 'bg-yellow-100 text-yellow-800' },
          { name: 'Qualified', order_index: 2, color: 'bg-indigo-100 text-indigo-800' },
          { name: 'Proposal Sent', order_index: 3, color: 'bg-purple-100 text-purple-800' },
          { name: 'Negotiation', order_index: 4, color: 'bg-amber-100 text-amber-800' },
          { name: 'Closed Won', order_index: 5, color: 'bg-green-100 text-green-800' },
          { name: 'Closed Lost', order_index: 6, color: 'bg-gray-100 text-gray-800' }
        ]
      }
    },
    include: { stages: true }
  });

  const stagesMap: Record<string, string> = {};
  pipeline.stages.forEach((s: any) => {
    stagesMap[s.name] = s.id;
  });

  // 5. Create Tags
  const tagsList = [
    { name: 'VIP Lead', color: '#EF4444', company_id: company.id },
    { name: 'High Budget', color: '#10B981', company_id: company.id },
    { name: 'Urgent', color: '#F59E0B', company_id: company.id },
    { name: 'Software', color: '#3B82F6', company_id: company.id }
  ];
  for (const t of tagsList) {
    await prisma.tag.create({ data: t });
  }

  // 6. Create WhatsApp Account
  const waAcc = await prisma.whatsAppAccount.create({
    data: {
      company_id: company.id,
      phoneNumberId: '109823471092834',
      whatsappBizId: '987123948712394',
      accessToken: 'EAAG123456789SAMPLETOKEN',
      status: 'CONNECTED',
      assigned_to_user: salesRep.id
    }
  });

  // 7. Create Leads with AI Score & Sentiment
  const leadsData = [
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.k@techcorp.in',
      phone: '+919812345678',
      company_name: 'TechCorp Solutions',
      address: 'Bangalore, India',
      status: 'PROPOSAL',
      source: 'WEBSITE',
      tags: 'VIP Lead, High Budget',
      ai_score: 92,
      sentiment: 'POSITIVE',
      assigned_to: salesRep.id,
      custom_fields: JSON.stringify({ requirement: 'CRM Implementation', teamSize: '50+' })
    },
    {
      name: 'Ananya Roy',
      email: 'ananya@innovate.co',
      phone: '+919823456789',
      company_name: 'Innovate Labs',
      address: 'Mumbai, India',
      status: 'QUALIFIED',
      source: 'FACEBOOK',
      tags: 'Software, Urgent',
      ai_score: 85,
      sentiment: 'POSITIVE',
      assigned_to: salesRep.id,
      custom_fields: JSON.stringify({ budget: '₹5,00,000' })
    },
    {
      name: 'Vikram Singh',
      email: 'vikram@singhenterprises.com',
      phone: '+919834567890',
      company_name: 'Singh Enterprises',
      address: 'Delhi NCR, India',
      status: 'NEW',
      source: 'WHATSAPP',
      tags: 'VIP Lead',
      ai_score: 68,
      sentiment: 'NEUTRAL',
      assigned_to: manager.id,
      custom_fields: JSON.stringify({})
    },
    {
      name: 'Sunita Sharma',
      email: 'sunita@greenfield.org',
      phone: '+919845678901',
      company_name: 'Greenfield Retail',
      address: 'Hyderabad, India',
      status: 'CONTACTED',
      source: 'GOOGLE',
      tags: 'High Budget',
      ai_score: 74,
      sentiment: 'NEUTRAL',
      assigned_to: admin.id,
      custom_fields: JSON.stringify({})
    },
    {
      name: 'Karan Mehta',
      email: 'karan@mehtalogistics.com',
      phone: '+919856789012',
      company_name: 'Mehta Logistics',
      address: 'Ahmedabad, India',
      status: 'WON',
      source: 'REFERRAL',
      tags: 'Software',
      ai_score: 98,
      sentiment: 'POSITIVE',
      assigned_to: salesRep.id,
      custom_fields: JSON.stringify({ closedOn: '2026-07-28' })
    }
  ];

  for (const item of leadsData) {
    const lead = await prisma.lead.create({
      data: {
        ...item,
        company_id: company.id
      }
    });

    // Create Deals for each lead
    let stageId = stagesMap['New Lead'];
    if (lead.status === 'PROPOSAL') stageId = stagesMap['Proposal Sent'];
    if (lead.status === 'QUALIFIED') stageId = stagesMap['Qualified'];
    if (lead.status === 'CONTACTED') stageId = stagesMap['Contacted'];
    if (lead.status === 'WON') stageId = stagesMap['Closed Won'];

    const dealValue = lead.status === 'WON' ? 850000 : 450000;

    const deal = await prisma.deal.create({
      data: {
        contact_id: lead.id,
        pipeline_id: pipeline.id,
        stage_id: stageId,
        title: `${lead.company_name} CRM License`,
        value: dealValue,
        currency: 'INR',
        stage: lead.status,
        probability: lead.status === 'WON' ? 100 : 60,
        assigned_to: lead.assigned_to,
        notes: 'Client interested in WhatsApp Cloud API and Call Integration'
      }
    });

    // Create Invoices for leads
    if ((lead.status === 'PROPOSAL' || lead.status === 'WON') && prisma.invoice) {
      const subtotal = dealValue;
      const gstAmount = subtotal * 0.18;
      const totalAmount = subtotal + gstAmount;

      await prisma.invoice.create({
        data: {
          company_id: company.id,
          contact_id: lead.id,
          invoice_number: `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
          subtotal,
          gst_rate: 18.0,
          gst_amount: gstAmount,
          total_amount: totalAmount,
          status: lead.status === 'WON' ? 'PAID' : 'UNPAID',
          due_date: new Date(Date.now() + 86400000 * 7),
          payment_link: `https://rzp.io/l/inv_${Math.random().toString(36).substring(7)}`,
          items: {
            create: [
              { description: 'Enterprise CRM License (1 Year)', quantity: 1, unit_price: subtotal * 0.7, total: subtotal * 0.7 },
              { description: 'WhatsApp API & Telephony Setup', quantity: 1, unit_price: subtotal * 0.3, total: subtotal * 0.3 }
            ]
          }
        }
      });
    }

    // Create Support Tickets
    if (prisma.ticket) {
      await prisma.ticket.create({
        data: {
          company_id: company.id,
          contact_id: lead.id,
          ticket_number: `TICK-${Math.floor(Math.random() * 9000 + 1000)}`,
          subject: `WhatsApp Webhook Integration Assistance for ${lead.company_name}`,
          description: 'Customer requested assistance with setting up WhatsApp Business Phone Number ID in CRM settings.',
          priority: lead.status === 'PROPOSAL' ? 'HIGH' : 'MEDIUM',
          status: lead.status === 'WON' ? 'RESOLVED' : 'OPEN',
          sla_due_at: new Date(Date.now() + 3600000 * 4), // 4 Hours SLA
          assigned_to: lead.assigned_to
        }
      });
    }

    // Create Tasks
    await prisma.task.create({
      data: {
        contact_id: lead.id,
        deal_id: deal.id,
        title: `Follow up call with ${lead.name}`,
        description: 'Discuss final pricing and WhatsApp API onboarding timeline.',
        due_date: new Date(Date.now() + 86400000 * 2),
        priority: lead.status === 'PROPOSAL' ? 'HIGH' : 'MEDIUM',
        status: lead.status === 'WON' ? 'COMPLETED' : 'PENDING',
        assigned_to: lead.assigned_to
      }
    });

    // Activities
    await prisma.activity.create({
      data: {
        contact_id: lead.id,
        agent_id: lead.assigned_to,
        type: 'STATUS_CHANGE',
        content: `Lead status updated to ${lead.status}`,
        timestamp: new Date(Date.now() - 3600000 * 12)
      }
    });

    // WhatsApp Messages
    await prisma.whatsAppMessage.create({
      data: {
        lead_id: lead.id,
        whatsapp_acc_id: waAcc.id,
        direction: 'INBOUND',
        message_type: 'TEXT',
        message_text: `Hi, we are interested in setting up your CRM system for our sales team at ${lead.company_name}. Please send details!`,
        status: 'READ',
        meta_message_id: `WAMID_${Math.random().toString(36).substring(7)}`,
        timestamp: new Date(Date.now() - 3600000 * 6)
      }
    });

    // Call Log
    await prisma.callLog.create({
      data: {
        contact_id: lead.id,
        agent_id: lead.assigned_to,
        direction: 'OUTBOUND',
        from_number: '+919876543210',
        to_number: lead.phone,
        duration_seconds: 145,
        status: 'COMPLETED',
        recording_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        timestamp: new Date(Date.now() - 3600000 * 4)
      }
    });
  }

  // 8. Create Workflow Rules
  if (prisma.workflowRule) {
    const workflowRules = [
      {
        company_id: company.id,
        name: 'Auto-Welcome WhatsApp Message on New Lead',
        trigger_event: 'LEAD_CREATED',
        action_type: 'SEND_WHATSAPP',
        action_config: JSON.stringify({ message: 'Hello! Thank you for reaching out to Apex Global. Our team will connect with you shortly.' }),
        is_active: true
      },
      {
        company_id: company.id,
        name: 'High Priority Alert on Proposal Stage',
        trigger_event: 'STATUS_CHANGED',
        action_type: 'ADD_TAG',
        action_config: JSON.stringify({ tag: 'Urgent Proposal' }),
        is_active: true
      }
    ];

    for (const wf of workflowRules) {
      await prisma.workflowRule.create({ data: wf });
    }
  }

  console.log('✅ Enterprise CRM Database seeded successfully with Invoices, Tickets, Workflows & AI Scores!');
}

main()
  .catch((e: any) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
