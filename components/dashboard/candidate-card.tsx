import Link from "next/link";
import { AlertTriangle, Move, Star } from "lucide-react";

import { daysSince } from "@/lib/dates";
import { stageAgeTone } from "@/lib/pipeline";
import { STAGE_THEME } from "@/components/dashboard/kanban/stage-theme";
import type { Candidate, Job } from "@/types/domain";

interface CandidateCardProps {
  candidate: Candidate;
  job?: Job;
  draggable?: boolean;
  onDragStart?: (candidateId: string) => void;
  onDragEnd?: () => void;
}

interface StageAgeToneClasses {
  dot: string;
  text: string;
}

function ageToneClasses(daysInStage: number): StageAgeToneClasses {
  const tone = stageAgeTone(daysInStage);
  if (tone === "ok") {
    return {
      dot: "bg-emerald-500",
      text: "text-emerald-700",
    };
  }

  if (tone === "warn") {
    return {
      dot: "bg-amber-500",
      text: "text-amber-700",
    };
  }

  return {
    dot: "bg-rose-500",
    text: "text-rose-700",
  };
}

function formatCreatedAgo(isoDate: string): string {
  const createdAt = new Date(isoDate).getTime();
  const diffMs = Math.max(Date.now() - createdAt, 0);
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    return "Added just now";
  }

  if (diffHours < 24) {
    return `Added ${diffHours}h ago`;
  }

  const days = Math.floor(diffHours / 24);
  if (days === 1) {
    return "Added 1 day ago";
  }

  return `Added ${days} days ago`;
}

function candidateSummary(candidate: Candidate, job?: Job): string {
  if (candidate.notes?.trim()) {
    return candidate.notes.trim();
  }

  if (candidate.currentRole?.trim()) {
    return candidate.currentRole.trim();
  }

  if (job?.title?.trim()) {
    return job.title.trim();
  }

  return "Candidate profile pending update.";
}

export function CandidateCard({
  candidate,
  job,
  draggable = false,
  onDragStart,
  onDragEnd,
}: CandidateCardProps) {
  const daysInStage = daysSince(candidate.stageUpdatedAt);
  const toneClasses = ageToneClasses(daysInStage);
  const stageTheme = STAGE_THEME[candidate.currentStage];
  const initials = candidate.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article
      draggable={draggable}
      onDragStart={() => onDragStart?.(candidate.id)}
      onDragEnd={onDragEnd}
      className={[
        "rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300",
        draggable ? "cursor-grab active:cursor-grabbing" : "",
      ].join(" ")}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-800 ring-1 ring-slate-200 shadow-inner">
            {initials}
          </div>
          <div>
            <Link href={`/candidates/${candidate.id}`} className="line-clamp-1 text-[13px] font-bold text-slate-800 hover:underline decoration-slate-300">
              {candidate.fullName}
            </Link>
            <p className="line-clamp-1 text-[9px] font-bold text-slate-400 uppercase tracking-tight">{formatCreatedAgo(candidate.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-0.5">
          {draggable ? <Move className="h-3 w-3 text-slate-200" /> : null}
          {daysInStage > 10 ? (
            <span title="Needs Attention">
              <AlertTriangle className="h-3 w-3 text-rose-500" />
            </span>
          ) : (
            <div className={["h-1.5 w-1.5 rounded-full ring-1 ring-white shadow-sm", stageTheme?.statusDotClass ?? toneClasses.dot].join(" ")} />
          )}
        </div>
      </div>

      <p className="line-clamp-2 text-[11.5px] font-medium leading-relaxed text-slate-500">{candidateSummary(candidate, job)}</p>

      <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2">
        <span className="inline-flex items-center gap-1 rounded bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 border border-slate-100/50">
          <Star className="h-2.5 w-2.5 text-slate-400" />
          {candidate.totalExperienceYrs ? `${candidate.totalExperienceYrs} yrs` : "N/A"}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">{String(candidate.source).replace(/_/g, " ").toLowerCase()}</span>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <p className={["text-[9px] font-bold uppercase tracking-tight", toneClasses.text].join(" ")}>
          {daysInStage === 0 ? "Moved today" : `${daysInStage} days in stage`}
        </p>
      </div>
    </article>
  );
}
