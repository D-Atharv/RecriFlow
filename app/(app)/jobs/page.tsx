import Link from "next/link";

import { PageHeading } from "@/components/ui/page-heading";
import { jobsService } from "@/server/services/jobs.service";

export default async function JobsPage() {
  const jobs = await jobsService.listJobs();

  return (
    <div>
      <PageHeading
        title="Jobs"
        description="Open and historical requisitions managed in a typed server layer."
        actions={
          <Link href="/jobs/new" className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-strong)]">
            + New Job
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-ink-muted)]">{job.department}</p>
            <h3 className="mt-1 text-lg font-semibold text-[color:var(--color-ink)]">{job.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--color-ink-soft)] line-clamp-3">{job.description}</p>
            <p className="mt-3 text-xs text-[color:var(--color-ink-muted)]">Experience: {job.experienceMin} - {job.experienceMax} years</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {job.requiredSkills.map((skill) => (
                <span key={skill} className="rounded-full bg-[color:var(--color-panel)] px-2 py-1 text-xs font-medium text-[color:var(--color-ink-soft)]">
                  {skill}
                </span>
              ))}
            </div>
            <Link href={`/jobs/${job.id}`} className="mt-4 inline-block text-sm text-[color:var(--color-primary)] hover:underline">
              View details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
