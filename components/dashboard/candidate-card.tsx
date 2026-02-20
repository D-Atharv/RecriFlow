import Link from "next/link";

import { daysSince } from "@/lib/dates";
import { stageAgeTone } from "@/lib/pipeline";
import type { Candidate, Job } from "@/types/domain";

interface CandidateCardProps {
  candidate: Candidate;
  job?: Job;
}

function ageToneClass(daysInStage: number): string {
  const tone = stageAgeTone(daysInStage);
  if (tone === "ok") {
    return "text-emerald-700";
  }

  if (tone === "warn") {
    return "text-amber-700";
  }

  return "text-rose-700";
}

export function CandidateCard({ candidate, job }: CandidateCardProps) {
  const daysInStage = daysSince(candidate.stageUpdatedAt);

  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="block rounded-xl border border-[color:var(--color-border)] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <p className="text-sm font-semibold text-[color:var(--color-ink)]">{candidate.fullName}</p>
      <p className="mt-1 text-xs text-[color:var(--color-ink-soft)]">
        {candidate.currentRole ?? "Role not provided"}
      </p>
      <p className="text-xs text-[color:var(--color-ink-muted)]">{job?.title ?? "Unassigned Job"}</p>
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="font-medium text-[color:var(--color-ink-soft)]">
          {candidate.totalExperienceYrs ?? "N/A"} yrs
        </span>
        <span className={`font-semibold ${ageToneClass(daysInStage)}`}>{daysInStage}d in stage</span>
      </div>
    </Link>
  );
}
