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
  const initials = candidate.fullName.split(' ').map(n => n.charAt(0)).slice(0, 2).join('').toUpperCase();

  return (
    <Link
      href={`/candidates/${candidate.id}`}
      className="block bg-white dark:bg-surface-dark p-4 rounded-lg shadow-card border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-grab group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-2 ring-white dark:ring-surface-dark">
            {initials}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{candidate.fullName}</h4>
            <p className="text-xs text-gray-500 line-clamp-1">{candidate.currentRole || "No Role"}</p>
          </div>
        </div>
        {daysInStage > 7 ? (
          <span className="material-symbols-outlined text-orange-400 text-sm" title="Needs Attention">warning</span>
        ) : (
          <div className={`h-2 w-2 rounded-full ${ageToneClass(daysInStage)}`}></div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mb-3">
        {job?.title ?? "Unassigned Job"}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
          <span className="material-symbols-outlined text-[10px]">star</span>
          {candidate.totalExperienceYrs ? `${candidate.totalExperienceYrs} yrs` : "N/A"}
        </span>
        <span className="text-xs text-gray-400 capitalize">{String(candidate.source).toLowerCase()}</span>
      </div>
    </Link>
  );
}
