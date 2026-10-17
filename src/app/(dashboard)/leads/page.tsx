import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getLeads } from "@/app/actions/leadActions";
import { getDealsWithPipeline } from "@/app/actions/dealActions";
import { prisma } from "@/lib/prisma";
import LeadManagementView from "@/components/LeadManagementView";

export const dynamic = "force-dynamic";

export default async function LeadPipelinePage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userRole = session?.user?.role || "SUPERADMIN";
  // @ts-ignore
  const userId = session?.user?.id;

  // If Sales Executive, only fetch leads assigned to them
  const leads = await getLeads(userRole === "SALESEXECUTIVE" && userId ? userId : undefined);
  const pipelineData = await getDealsWithPipeline();
  
  const staffUsers = await prisma.user.findMany({
    where: userRole === "SALESEXECUTIVE" && userId ? { id: userId } : undefined,
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
