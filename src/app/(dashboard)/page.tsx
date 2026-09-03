import { getDashboardStats } from "@/app/actions/leadActions";
import AdvancedDashboard from "./AdvancedDashboard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="-m-4 lg:-m-8">
      <AdvancedDashboard stats={stats} />
    </div>
  );
}
