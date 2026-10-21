import { prisma } from "@/lib/prisma";
import TeamHRView from "@/components/TeamHRView";

export const dynamic = "force-dynamic";

export default async function HRPage() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true, email: true }
  });

  return <TeamHRView users={users} />;
}
