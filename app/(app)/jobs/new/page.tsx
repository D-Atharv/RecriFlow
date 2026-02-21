import { CreateJobOpeningForm } from "@/components/jobs/new/create-job-opening-form";
import { requireAppRole } from "@/server/auth/guards";
import { usersService } from "@/server/services/users.service";

export default async function NewJobPage() {
  const user = await requireAppRole(["ADMIN", "RECRUITER"]);
  const users = await usersService.listUsers();
  const hiringTeamCandidates = users.filter(
    (member) => member.isActive && ["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(member.role),
  );

  return (
    <CreateJobOpeningForm
      actorUserId={user.id}
      hiringTeamCandidates={hiringTeamCandidates}
    />
  );
}
