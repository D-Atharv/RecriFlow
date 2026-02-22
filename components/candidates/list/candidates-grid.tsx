"use client";

import { Star } from "lucide-react";

import { formatDate } from "@/lib/dates";
import { StatusPill } from "@/components/ui/status-pill";
import { CandidateActionsMenu } from "@/components/candidates/list/candidate-actions-menu";
import type { CandidateListItem, Job, PipelineStage } from "@/types/domain";

interface CandidateListRow {
  candidate: CandidateListItem;
  job?: Job;
  latestRating: number | null;
}

interface CandidatesGridProps {
  rows: CandidateListRow[];
  canManage: boolean;
  onAdvanceStage: (candidate: CandidateListItem, stage: PipelineStage) => Promise<void>;
  onArchiveCandidate: (candidate: CandidateListItem) => Promise<void>;
}

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((token) => token[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarTone(index: number): string {
  const tones = [
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  return tones[index % tones.length];
}

export function CandidatesGrid({ rows, canManage, onAdvanceStage, onArchiveCandidate }: CandidatesGridProps) {
  if (rows.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-card">
        No candidates match the selected filters.
      </section>
    );
  }

  return (
    <section className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {rows.map((row, index) => (
        <article
          key={row.candidate.id}
          className="rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300"
        >
          <div className="flex items-start justify-end p-1.5 pb-0">
            <CandidateActionsMenu
              candidate={row.candidate}
              canManage={canManage}
              onAdvanceStage={onAdvanceStage}
              onArchiveCandidate={onArchiveCandidate}
            />
          </div>

          <div className="px-4 pb-3.5 text-center">
            <div
              className={[
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold ring-1 ring-slate-100 shadow-sm",
                getAvatarTone(index),
              ].join(" ")}
            >
              {getInitials(row.candidate.fullName)}
            </div>
            <h3 className="mt-2 text-[13px] font-bold tracking-tight text-slate-800 line-clamp-1">{row.candidate.fullName}</h3>
            <p className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">{row.candidate.email}</p>

            <div className="mt-2 flex items-center justify-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-50/50 py-0.5 rounded border border-slate-200/50">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              {row.latestRating !== null ? row.latestRating.toFixed(1) : "-"}
            </div>

            <div className="mt-2 flex justify-center">
              <StatusPill stage={row.candidate.currentStage} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100/60 px-4 py-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
            <span>Applied {formatDate(row.candidate.createdAt)}</span>
            <span className="truncate ml-2">{row.job?.department ?? "No dept"}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
