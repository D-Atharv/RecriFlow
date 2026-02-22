"use client";

import Link from "next/link";
import { Star, Search } from "lucide-react";
import { formatDate } from "@/lib/dates";
import { StatusPill } from "@/components/ui/status-pill";
import { CandidateActionsMenu } from "@/components/candidates/list/candidate-actions-menu";
import type { CandidateListItem, Job, PipelineStage } from "@/types/domain";

interface CandidateListRow {
  candidate: CandidateListItem;
  job?: Job;
  latestRating: number | null;
}

interface CandidatesDataTableProps {
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

export function CandidatesDataTable({ rows, canManage, onAdvanceStage, onArchiveCandidate }: CandidatesDataTableProps) {
  return (
    <section className="flex min-h-[400px] lg:min-h-[calc(100vh-320px)] flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm">
      <div className="relative flex-1 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/50">
            <tr className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              <th className="w-10 px-4 py-2.5">
                <input type="checkbox" aria-label="Select all candidates" className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
              </th>
              <th className="px-4 py-2.5">Candidate</th>
              <th className="px-4 py-2.5">Applied Role</th>
              <th className="px-4 py-2.5">Stage</th>
              <th className="px-4 py-2.5">Rating</th>
              <th className="px-4 py-2.5">Date Applied</th>
              <th className="w-14 px-4 py-2.5 text-right" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={row.candidate.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-2">
                  <input type="checkbox" aria-label={`Select ${row.candidate.fullName}`} className="h-3.5 w-3.5 rounded border-slate-300 group-hover:border-slate-400 transition-colors" />
                </td>

                <td className="px-4 py-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={[
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ring-1 ring-white shadow-sm",
                        getAvatarTone(index),
                      ].join(" ")}
                    >
                      {getInitials(row.candidate.fullName)}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/candidates/${row.candidate.id}`}
                        className="truncate block text-[13px] font-bold leading-tight text-slate-800 hover:underline decoration-slate-400/50"
                      >
                        {row.candidate.fullName}
                      </Link>
                      <p className="truncate text-[10px] font-medium text-slate-400 lowercase">{row.candidate.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-2 align-middle">
                  <p className="text-[12px] font-bold text-slate-700 line-clamp-1">{row.candidate.currentRole ?? row.job?.title ?? "Unassigned role"}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.job?.department ?? "No department"}</p>
                </td>

                <td className="px-4 py-2">
                  <StatusPill stage={row.candidate.currentStage} />
                </td>

                <td className="px-4 py-2">
                  <p className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold text-slate-600 bg-slate-100/50 px-1.5 py-0.5 rounded border border-slate-200/50">
                    <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                    {row.latestRating !== null ? row.latestRating.toFixed(1) : "-"}
                  </p>
                </td>

                <td className="px-4 py-2 text-[11px] font-medium text-slate-500 whitespace-nowrap">{formatDate(row.candidate.createdAt)}</td>

                <td className="px-4 py-2 text-right">
                  <CandidateActionsMenu
                    candidate={row.candidate}
                    canManage={canManage}
                    onAdvanceStage={onAdvanceStage}
                    onArchiveCandidate={onArchiveCandidate}
                  />
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr className="flex-1">
                <td colSpan={7} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="rounded-full bg-slate-50 p-4">
                      <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No candidates found</p>
                    <p className="text-[12px] text-slate-400">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
