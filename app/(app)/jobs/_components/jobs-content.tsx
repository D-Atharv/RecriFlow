import { JobsPageClient } from "@/components/jobs/list/jobs-page-client";
import { buildJobListItems } from "@/components/jobs/list/jobs-view-model";
import type { JobManagerOption } from "@/components/jobs/list/types";
import { getCachedCandidatesLean, getCachedJobs, getCachedUsers } from "@/server/cache/queries";

interface JobsContentProps {
  canManage: boolean;
}

function toManagers(items: ReturnType<typeof buildJobListItems>): JobManagerOption[] {
  const entries = new Map<string, string>();

  for (const item of items) {
    entries.set(item.job.createdById, item.managerName);
  }

  return Array.from(entries.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function JobsContent({ canManage }: JobsContentProps) {
  const [jobs, candidates, users] = await Promise.all([
    getCachedJobs(),
    getCachedCandidatesLean(),
    getCachedUsers(),
  ]);

  const items = buildJobListItems({ jobs, candidates, users });
  const managers = toManagers(items);

  return (
    <JobsPageClient
      initialItems={items}
      managers={managers}
      canManage={canManage}
    />
  );
}
