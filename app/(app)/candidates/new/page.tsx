import { NewCandidateWizard } from "@/components/candidates/new-candidate-wizard";
import { PageHeading } from "@/components/ui/page-heading";
import { requireAppRole } from "@/server/auth/guards";
import { jobsService } from "@/server/services/jobs.service";

export default async function NewCandidatePage() {
  await requireAppRole(["ADMIN", "RECRUITER"]);
  const jobs = await jobsService.listOpenJobs();

  return (
    <div>
      <PageHeading
        title="Add Candidate"
        description="Three-step flow: upload resume, review parsed fields, assign job."
      />
      <NewCandidateWizard jobs={jobs} />
    </div>
  );
}
