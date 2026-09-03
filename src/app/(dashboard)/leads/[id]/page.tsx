import { getLeadById } from "@/app/actions/leadActions";
import LeadDetailView from "@/components/LeadDetailView";
import { notFound } from "next/navigation";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(id);

  if (!lead) {
    notFound();
  }

  return <LeadDetailView lead={lead} />;
}
