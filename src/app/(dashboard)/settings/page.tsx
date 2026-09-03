import { prisma } from "@/lib/prisma";
import SettingsView from "@/components/SettingsView";

export default async function SettingsPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" }
  });
  const company = await prisma.company.findFirst();

  return <SettingsView users={users} company={company} />;
}
