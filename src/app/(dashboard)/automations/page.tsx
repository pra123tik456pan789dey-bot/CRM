import { getWorkflowRules } from "@/app/actions/workflowActions";
import WorkflowsView from "@/components/WorkflowsView";

export default async function AutomationsPage() {
  const rules = await getWorkflowRules();

  return <WorkflowsView initialRules={rules} />;
}
