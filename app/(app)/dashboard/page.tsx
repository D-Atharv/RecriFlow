import { Suspense } from "react";

import { requireAppRole } from "@/server/auth/guards";
import { DashboardContent } from "./_components/dashboard-content";
import { DashboardSkeleton } from "./_components/dashboard-skeleton";

export default async function DashboardPage() {
  const user = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent canCreateCandidate={["ADMIN", "RECRUITER"].includes(user.role)} />
    </Suspense>
  );
}
