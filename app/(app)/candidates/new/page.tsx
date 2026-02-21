import { CandidateCreateWizard } from "@/components/candidates/create/candidate-create-wizard";
import { requireAppRole } from "@/server/auth/guards";
import { jobsService } from "@/server/services/jobs.service";

export default async function NewCandidatePage() {
  await requireAppRole(["ADMIN", "RECRUITER"]);
  const jobs = await jobsService.listOpenJobs();

  return <CandidateCreateWizard jobs={jobs} />;
}
