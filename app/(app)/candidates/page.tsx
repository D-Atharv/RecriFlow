import { Suspense } from "react";

import { requireAppRole } from "@/server/auth/guards";
import { CandidatesContent } from "./_components/candidates-content";
import { CandidatesSkeleton } from "./_components/candidates-skeleton";

export default async function CandidatesPage() {
  const user = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);

  return (
    <Suspense fallback={<CandidatesSkeleton />}>
      <CandidatesContent canManage={["ADMIN", "RECRUITER"].includes(user.role)} />
    </Suspense>
  );
}
