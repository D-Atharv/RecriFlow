import { CandidatesTableClient } from "@/components/candidates/candidates-table-client";
import { requireAppRole } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  const user = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);
  const [candidates, jobs] = await Promise.all([candidatesService.listCandidates(), jobsService.listJobs()]);

  return <CandidatesTableClient candidates={candidates} jobs={jobs} canManage={["ADMIN", "RECRUITER"].includes(user.role)} />;
}
