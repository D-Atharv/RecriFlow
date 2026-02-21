import Link from "next/link";

import { JobActionsMenu } from "@/components/jobs/list/job-actions-menu";
import { JobStatusPill } from "@/components/jobs/list/job-status-pill";
import type { JobListItem } from "@/components/jobs/list/types";
import type { JobStatus } from "@/types/domain";

interface JobsDataTableProps {
  rows: JobListItem[];
  canManage: boolean;
  onStatusChange: (jobId: string, status: JobStatus) => Promise<void>;
}

function getRoleBadgeTone(index: number): string {
  const tones = [
    "bg-slate-100 text-slate-800",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  return tones[index % tones.length];
}

function toRoleCode(title: string): string {
  return title
    .split(/\s+/)
    .map((token) => token.charAt(0))
    .filter(Boolean)
    .slice(0, 3)
    .join("")
    .toUpperCase();
}

export function JobsDataTable({ rows, canManage, onStatusChange }: JobsDataTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">
              <th className="w-12 px-6 py-3">
                <input type="checkbox" aria-label="Select all jobs" className="h-4 w-4 rounded border-gray-300" />
              </th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Pipeline</th>
              <th className="px-4 py-3">Posted</th>
              <th className="px-4 py-3">Status</th>
              <th className="w-16 px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const codeTone = getRoleBadgeTone(index);
              const roleCode = toRoleCode(row.job.title);

              return (
                <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80">
                  <td className="px-6 py-2.5">
                    <input type="checkbox" aria-label={`Select ${row.job.title}`} className="h-4 w-4 rounded border-gray-300" />
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${codeTone}`}>
                        {roleCode}
                      </span>
                      <div>
                        <Link href={`/jobs/${row.id}`} className="text-[14px] font-semibold leading-tight text-slate-800 hover:text-slate-900">
                          {row.job.title}
                        </Link>
                        <p className="text-[11px] text-slate-400">
                          {Math.round(row.job.experienceMin)}-{Math.round(row.job.experienceMax)} yrs experience
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2.5 align-middle">
                    <p className="text-[13px] font-medium text-slate-800">{row.job.department}</p>
                    <p className="text-[11px] text-slate-400">Owner: {row.managerName}</p>
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {row.recentCandidateInitials.slice(0, 3).map((initials, initialsIndex) => (
                          <span
                            key={`${initials}-${initialsIndex}`}
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-[8px] font-semibold text-white shadow-sm"
                          >
                            {initials}
                          </span>
                        ))}
                        {row.activeCandidates > 3 ? (
                          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-gray-100 px-1 text-[9px] font-semibold text-gray-600">
                            +{row.activeCandidates - 3}
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-800">{row.activeCandidates} Active Candidates</p>
                        <p className="text-[9px] text-slate-400">Total: {row.totalCandidates}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-2.5 text-[11px] font-medium text-slate-500">{row.postedLabel}</td>

                  <td className="px-4 py-2.5">
                    <JobStatusPill status={row.job.status} />
                  </td>

                  <td className="px-4 py-2.5 text-right">
                    <JobActionsMenu
                      job={row.job}
                      canManage={canManage}
                      onStatusChange={async (job, status) => onStatusChange(job.id, status)}
                    />
                  </td>
                </tr>
              );
            })}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center text-sm text-gray-500">
                  No jobs match the selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
