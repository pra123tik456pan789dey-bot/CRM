import { getLeads } from "@/app/actions/leadActions";
import { getDealsWithPipeline } from "@/app/actions/dealActions";
import LeadManagementView from "@/components/LeadManagementView";

export default async function LeadPipelinePage() {
  const leads = await getLeads();
  const pipelineData = await getDealsWithPipeline();

  return (
    <div className="h-full flex flex-col">
      <LeadManagementView initialLeads={leads} pipelineData={pipelineData} />
    </div>
  );
}
