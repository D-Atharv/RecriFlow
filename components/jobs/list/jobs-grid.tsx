import Link from "next/link";
import { Users } from "lucide-react";

import { JobActionsMenu } from "@/components/jobs/list/job-actions-menu";
import { JobStatusPill } from "@/components/jobs/list/job-status-pill";
import type { JobListItem } from "@/components/jobs/list/types";
import type { JobStatus } from "@/types/domain";
import { formatDate } from "@/lib/dates";

interface JobsGridProps {
  rows: JobListItem[];
  canManage: boolean;
  onStatusChange: (jobId: string, status: JobStatus) => Promise<void>;
}

function getRoleBadgeTone(index: number): string {
  const tones = [
    "bg-slate-100 text-slate-700",
    "bg-slate-200 text-slate-800",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  return tones[index % tones.length];
}

function getInitials(title: string): string {
  return title
    .split(/\s+/)
    .map((token) => token[0] ?? "")
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

export function JobsGrid({ rows, canManage, onStatusChange }: JobsGridProps) {
  if (rows.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200/60 bg-white p-10 text-center text-sm text-slate-500">
        No jobs match the selected filters.
      </section>
    );
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {rows.map((row, index) => (
        <article
          key={row.job.id}
          className="rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300"
        >
          <div className="flex items-start justify-end p-2 pb-0">
            <JobActionsMenu
              job={row.job}
              canManage={canManage}
              onStatusChange={(job, status) => onStatusChange(row.job.id, status)}
            />
          </div>

          <div className="px-4 pb-4 text-center">
            <div
              className={[
                "mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-[10px] font-bold",
                getRoleBadgeTone(index),
              ].join(" ")}
            >
              {getInitials(row.job.title)}
            </div>
            <h3 className="mt-2.5 text-[15px] font-semibold tracking-tight text-slate-800">{row.job.title}</h3>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {Math.round(row.job.experienceMin)}-{Math.round(row.job.experienceMax)} yrs experience
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex -space-x-1.5">
                {row.recentCandidateInitials.slice(0, 3).map((initials, i) => (
                  <div
                    key={`${initials}-${i}`}
                    className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-slate-800 text-[6px] font-bold text-white shadow-sm"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-medium text-slate-500">{row.activeCandidates} Active</p>
            </div>

            <div className="mt-3 flex justify-center">
              <JobStatusPill status={row.job.status} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100/80 px-4 py-2 text-[10px] font-medium text-slate-400">
            <span>Posted {formatDate(row.job.createdAt)}</span>
            <span className="truncate ml-2">{row.job.department}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
