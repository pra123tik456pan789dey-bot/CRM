import { prisma } from "@/lib/prisma";
import SuperAdminView from "@/components/SuperAdminView";
import { getAllWhatsAppAccounts } from "@/app/actions/multiWhatsAppActions";
import { getBackupHistory } from "@/app/actions/backupActions";

export const dynamic = "force-dynamic";

export default async function SuperAdminPage() {
  let company = null;
  let users: any[] = [];
  let whatsappAccounts: any[] = [];
  let backups: any[] = [];
  let dbError: string | null = null;

  try {
    company = await prisma.company.findFirst();
    users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    whatsappAccounts = await getAllWhatsAppAccounts();
    backups = await getBackupHistory();
  } catch (err: any) {
    console.error("SuperAdminPage DB Fetch Error:", err);
    dbError = err.message || "Database connection error";
  }

  return (
    <SuperAdminView
      company={company}
      users={users}
      whatsappAccounts={whatsappAccounts}
      backups={backups}
      dbError={dbError}
    />
  );
}

