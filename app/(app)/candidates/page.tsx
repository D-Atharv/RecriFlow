import Link from "next/link";

import { CandidatesTableClient } from "@/components/candidates/candidates-table-client";
import { PageHeading } from "@/components/ui/page-heading";
import { requireAppRole } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";

export const dynamic = "force-dynamic";

export default async function CandidatesPage() {
  await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);
  const [candidates, jobs] = await Promise.all([candidatesService.listCandidates(), jobsService.listJobs()]);

  return (
    <div>
      <PageHeading
        title="Candidates"
        description="Central candidate registry with stage, source, and assignment visibility."
        actions={
          <Link
            href="/candidates/new"
            className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-strong)]"
          >
            + New Candidate
          </Link>
        }
      />

      <CandidatesTableClient candidates={candidates} jobs={jobs} />
    </div>
  );
}
