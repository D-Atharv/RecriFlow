import { notFound } from "next/navigation";

import { JobDetailDashboard } from "@/components/jobs/detail/job-detail-dashboard";
import { requireAppRole } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const user = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"]);
  const { id } = await params;
  const job = await jobsService.getJobById(id);

  if (!job) {
    notFound();
  }

  const candidates = await candidatesService.listCandidates({ jobId: job.id });

  return <JobDetailDashboard job={job} candidates={candidates} canManage={["ADMIN", "RECRUITER"].includes(user.role)} />;
}
