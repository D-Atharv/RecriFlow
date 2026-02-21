"use client";

import { BarChart3, Building2, CircleDollarSign, RefreshCcw } from "lucide-react";
import { formatDate } from "@/lib/dates";
import type { Job } from "@/types/domain";

interface JobBlueprintProps {
  job: Job;
}

function formatJobStatus(status: Job["status"]): string {
  switch (status) {
    case "OPEN":
      return "Open";
    case "ON_HOLD":
      return "On hold";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
}

export function JobBlueprint({ job }: JobBlueprintProps) {
  const items = [
    {
      label: "Experience",
      value: `${job.experienceMin}-${job.experienceMax} years`,
      icon: <BarChart3 className="h-3.5 w-3.5" />,
    },
    {
      label: "Status",
      value: formatJobStatus(job.status),
      icon: <CircleDollarSign className="h-3.5 w-3.5" />,
    },
    {
      label: "Department",
      value: job.department,
      icon: <Building2 className="h-3.5 w-3.5" />,
    },
    {
      label: "Updated",
      value: formatDate(job.updatedAt),
      icon: <RefreshCcw className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <article className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Job Blueprint</h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 px-0.5">
            <div className="space-y-0.5">
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none">{item.label}</p>
              <p className="text-[11px] font-bold text-slate-800 leading-tight">{item.value}</p>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-50/50 text-slate-400 border border-slate-100 shadow-sm">
              <div className="scale-75">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
