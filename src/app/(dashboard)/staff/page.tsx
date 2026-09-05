import { prisma } from "@/lib/prisma";
import StaffView from "@/components/StaffView";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  return <StaffView initialUsers={users} />;
}
