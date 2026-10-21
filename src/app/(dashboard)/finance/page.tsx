import { prisma } from "@/lib/prisma";
import FinanceStudioView from "@/components/FinanceStudioView";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" }
  });

  return <FinanceStudioView initialInvoices={invoices} />;
}
