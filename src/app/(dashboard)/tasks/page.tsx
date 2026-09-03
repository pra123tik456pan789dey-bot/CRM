import { getTasks } from "@/app/actions/taskActions";
import { getLeads } from "@/app/actions/leadActions";
import TasksView from "@/components/TasksView";

export default async function TasksPage() {
  const tasks = await getTasks();
  const leads = await getLeads();

  return <TasksView initialTasks={tasks} leads={leads} />;
}
