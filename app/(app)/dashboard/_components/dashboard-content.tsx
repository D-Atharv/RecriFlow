import { KanbanBoardClient } from "@/components/dashboard/kanban-board-client";
import { getCachedCandidatesLean, getCachedJobs } from "@/server/cache/queries";

interface DashboardContentProps {
  canCreateCandidate: boolean;
}

export async function DashboardContent({ canCreateCandidate }: DashboardContentProps) {
  const [candidates, jobs] = await Promise.all([getCachedCandidatesLean(), getCachedJobs()]);

  return (
    <KanbanBoardClient
      candidates={candidates}
      jobs={jobs}
      canCreateCandidate={canCreateCandidate}
    />
  );
}
