import { notFound } from "next/navigation";

import { JobDetailDashboard } from "@/components/jobs/detail/job-detail-dashboard";
import { requireAppRole } from "@/server/auth/guards";
import { getCachedCandidates, getCachedJob } from "@/server/cache/queries";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const user = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"]);
  const { id } = await params;

  const [job, allCandidates] = await Promise.all([getCachedJob(id), getCachedCandidates()]);

  if (!job) {
    notFound();
  }

  const candidates = allCandidates.filter((c) => c.jobId === job.id);

  return <JobDetailDashboard job={job} candidates={candidates} canManage={["ADMIN", "RECRUITER"].includes(user.role)} />;
}
