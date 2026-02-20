import { JobFormClient } from "@/components/jobs/job-form-client";
import { PageHeading } from "@/components/ui/page-heading";
import { requireAppRole } from "@/server/auth/guards";

export default async function NewJobPage() {
  await requireAppRole(["ADMIN", "RECRUITER"]);

  return (
    <div>
      <PageHeading title="Create Job" description="Add a new position and required skill profile." />
      <JobFormClient mode="create" />
    </div>
  );
}
