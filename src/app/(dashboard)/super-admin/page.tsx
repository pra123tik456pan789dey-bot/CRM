import { prisma } from "@/lib/prisma";
import SuperAdminView from "@/components/SuperAdminView";
import { getAllWhatsAppAccounts } from "@/app/actions/multiWhatsAppActions";
import { getBackupHistory } from "@/app/actions/backupActions";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  const company = await prisma.company.findFirst();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  const whatsappAccounts = await getAllWhatsAppAccounts();
  const backups = await getBackupHistory();

  return <SuperAdminView company={company} users={users} whatsappAccounts={whatsappAccounts} backups={backups} />;
}

