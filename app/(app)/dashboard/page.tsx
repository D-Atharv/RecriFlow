import { KanbanBoardClient } from "@/components/dashboard/kanban-board-client";
import { PageHeading } from "@/components/ui/page-heading";
import { requireAppRole } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);
  const [candidates, jobs] = await Promise.all([candidatesService.listCandidates(), jobsService.listJobs()]);

  return (
    <div>
      <PageHeading
        title="Dashboard"
        description="Track every candidate across pipeline stages with real-time server data."
      />
      <KanbanBoardClient candidates={candidates} jobs={jobs} />
    </div>
  );
}
