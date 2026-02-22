import { CandidatesTableClient } from "@/components/candidates/candidates-table-client";
import { getCachedCandidatesLean, getCachedJobs } from "@/server/cache/queries";

interface CandidatesContentProps {
  canManage: boolean;
}

export async function CandidatesContent({ canManage }: CandidatesContentProps) {
  const [candidates, jobs] = await Promise.all([getCachedCandidatesLean(), getCachedJobs()]);

  return (
    <CandidatesTableClient
      candidates={candidates}
      jobs={jobs}
      canManage={canManage}
    />
  );
}
