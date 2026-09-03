import { getAllCallLogs } from "@/app/actions/telephonyActions";
import { getLeads } from "@/app/actions/leadActions";
import CallsView from "@/components/CallsView";

export default async function CallsPage() {
  const logs = await getAllCallLogs();
  const leads = await getLeads();

  return <CallsView logs={logs} leads={leads} />;
}
