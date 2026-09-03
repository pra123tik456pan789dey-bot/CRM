import { getInvoices } from "@/app/actions/invoiceActions";
import { getLeads } from "@/app/actions/leadActions";
import InvoicesView from "@/components/InvoicesView";

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  const leads = await getLeads();

  return <InvoicesView initialInvoices={invoices} leads={leads} />;
}
