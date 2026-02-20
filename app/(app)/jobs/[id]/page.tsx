import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/ui/page-heading";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await jobsService.getJobById(id);

  if (!job) {
    notFound();
  }

  const candidates = await candidatesService.listCandidates({ jobId: job.id });

  return (
    <div className="space-y-6">
      <PageHeading title={job.title} description={`${job.department} • ${job.status}`} />

      <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-5">
        <p className="text-sm text-[color:var(--color-ink-soft)]">{job.description}</p>
        <p className="mt-3 text-xs text-[color:var(--color-ink-muted)]">
          Experience: {job.experienceMin} - {job.experienceMax} years
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.requiredSkills.map((skill) => (
            <span key={skill} className="rounded-full bg-[color:var(--color-panel)] px-3 py-1 text-xs font-medium text-[color:var(--color-ink-soft)]">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-5">
        <h3 className="text-lg font-semibold">Candidates in this Job ({candidates.length})</h3>
        {candidates.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">No candidates have been assigned yet.</p>
        ) : (
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {candidates.map((candidate) => (
              <article key={candidate.id} className="rounded-lg border border-[color:var(--color-border)] p-3">
                <p className="font-semibold text-[color:var(--color-ink)]">{candidate.fullName}</p>
                <p className="text-xs text-[color:var(--color-ink-soft)]">{candidate.currentRole ?? "Role not provided"}</p>
                <p className="mt-1 text-xs text-[color:var(--color-ink-muted)]">Stage: {candidate.currentStage}</p>
                <Link href={`/candidates/${candidate.id}`} className="mt-2 inline-block text-xs text-[color:var(--color-primary)] hover:underline">
                  Open profile
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
