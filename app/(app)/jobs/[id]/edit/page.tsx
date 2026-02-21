import { notFound } from "next/navigation";

import { CreateJobOpeningForm } from "@/components/jobs/new/create-job-opening-form";
import { requireAppRole } from "@/server/auth/guards";
import { jobsService } from "@/server/services/jobs.service";
import { usersService } from "@/server/services/users.service";

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: EditJobPageProps) {
  const user = await requireAppRole(["ADMIN", "RECRUITER"]);
  const { id } = await params;

  const [job, users] = await Promise.all([jobsService.getJobById(id), usersService.listUsers()]);

  if (!job) {
    notFound();
  }

  const hiringTeamCandidates = users.filter(
    (member) => member.isActive && ["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(member.role),
  );

  return (
    <CreateJobOpeningForm
      mode="edit"
      job={job}
      actorUserId={user.id}
      hiringTeamCandidates={hiringTeamCandidates}
    />
  );
}
