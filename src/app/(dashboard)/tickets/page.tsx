import { getTickets } from "@/app/actions/ticketActions";
import { getLeads } from "@/app/actions/leadActions";
import TicketsView from "@/components/TicketsView";

export default async function TicketsPage() {
  const tickets = await getTickets();
  const leads = await getLeads();

  return <TicketsView initialTickets={tickets} leads={leads} />;
}
