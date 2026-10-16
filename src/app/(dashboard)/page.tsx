import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  getDashboardStats,
  getEmployeeDashboardData,
  getManagerDashboardData
} from "@/app/actions/leadActions";
import AdvancedDashboard from "./AdvancedDashboard";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import ManagerDashboard from "@/components/ManagerDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userRole = session?.user?.role || "SUPERADMIN";
  // @ts-ignore
  const userId = session?.user?.id;

  // 1. 🟢 Sales Executive / Employee View (Mobile-First Calling & Leads Desk)
  if (userRole === "SALESEXECUTIVE" && userId) {
    const employeeData = await getEmployeeDashboardData(userId);
    return (
      <div className="-m-1 sm:-m-3 lg:-m-4">
        <EmployeeDashboard data={employeeData} />
      </div>
    );
  }

  // 2. 🟣 Manager / HR Operations View (Team Calling Activity & Lead Distribution)
  if (userRole === "MANAGER") {
    const managerData = await getManagerDashboardData();
    return (
      <div className="-m-1 sm:-m-3 lg:-m-4">
        <ManagerDashboard data={managerData} />
      </div>
    );
  }

  // 3. 👑 Super Admin / Business Owner View (Company Revenue, SaaS Metrics & Global Settings)
  const stats = await getDashboardStats();
  return (
    <div className="-m-4 lg:-m-8">
      <AdvancedDashboard stats={stats} />
    </div>
  );
}
