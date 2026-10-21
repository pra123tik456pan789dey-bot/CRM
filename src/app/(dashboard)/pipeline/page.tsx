import { prisma } from "@/lib/prisma";
import ZepflySalesPipelineView from "@/components/ZepflySalesPipelineView";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const [deals, leads, users] = await Promise.all([
    prisma.deal.findMany({
      include: {
        contact: true,
        assignee: true
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.lead.findMany({
      select: { id: true, name: true }
    }),
    prisma.user.findMany({
      select: { id: true, name: true, role: true }
    })
  ]);

  return <ZepflySalesPipelineView initialDeals={deals} leads={leads} users={users} />;
}
