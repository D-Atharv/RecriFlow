import { Suspense } from "react";

import { requireAppRole } from "@/server/auth/guards";
import { JobsContent } from "./_components/jobs-content";
import { JobsSkeleton } from "./_components/jobs-skeleton";

export default async function JobsPage() {
  const user = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"]);

  return (
    <Suspense fallback={<JobsSkeleton />}>
      <JobsContent canManage={["ADMIN", "RECRUITER"].includes(user.role)} />
    </Suspense>
  );
}
