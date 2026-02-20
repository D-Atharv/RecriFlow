import { KanbanBoardClient } from "@/components/dashboard/kanban-board-client";
import { requireAppRole } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);
  const [candidates, jobs] = await Promise.all([candidatesService.listCandidates(), jobsService.listJobs()]);

  return <KanbanBoardClient candidates={candidates} jobs={jobs} />;
}
