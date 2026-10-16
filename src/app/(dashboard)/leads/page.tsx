import { getLeads } from "@/app/actions/leadActions";
import { getDealsWithPipeline } from "@/app/actions/dealActions";
import { prisma } from "@/lib/prisma";
import LeadManagementView from "@/components/LeadManagementView";

export const dynamic = "force-dynamic";

export default async function LeadPipelinePage() {
  const leads = await getLeads();
  const pipelineData = await getDealsWithPipeline();
  const staffUsers = await prisma.user.findMany({
    select: { id: true, name: true, role: true, email: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="h-full flex flex-col">
      <LeadManagementView
        initialLeads={leads}
        pipelineData={pipelineData}
        staffUsers={staffUsers}
      />
    </div>
  );
}
