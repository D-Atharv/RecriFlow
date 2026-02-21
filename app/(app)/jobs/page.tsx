import { JobsPageClient } from "@/components/jobs/list/jobs-page-client";
import { buildJobListItems } from "@/components/jobs/list/jobs-view-model";
import type { JobManagerOption } from "@/components/jobs/list/types";
import { requireAppRole } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";
import { usersService } from "@/server/services/users.service";

export const dynamic = "force-dynamic";

function toManagers(items: ReturnType<typeof buildJobListItems>): JobManagerOption[] {
  const entries = new Map<string, string>();

  for (const item of items) {
    entries.set(item.job.createdById, item.managerName);
  }

  return Array.from(entries.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default async function JobsPage() {
  const user = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"]);
  const [jobs, candidates, users] = await Promise.all([
    jobsService.listJobs(),
    candidatesService.listCandidates(),
    usersService.listUsers(),
  ]);

  const items = buildJobListItems({ jobs, candidates, users });
  const managers = toManagers(items);

  return (
    <JobsPageClient
      initialItems={items}
      managers={managers}
      canManage={["ADMIN", "RECRUITER"].includes(user.role)}
    />
  );
}
