import { formatDate } from "@/lib/dates";
import { STAGE_LABELS } from "@/lib/pipeline";
import type { Candidate } from "@/types/domain";

import { formatEnumLabel } from "@/components/candidates/detail/candidate-detail.utils";

interface CandidateSnapshotCardProps {
  candidate: Candidate;
  appliedRole: string;
  department: string;
}

export function CandidateSnapshotCard({ candidate, appliedRole, department }: CandidateSnapshotCardProps) {
  const items: Array<{ label: string; value: string }> = [
    { label: "Email", value: candidate.email },
    { label: "Phone", value: candidate.phone ?? "Not provided" },
    { label: "Role", value: appliedRole },
    { label: "Dept", value: department },
    { label: "Current", value: candidate.currentRole ?? "Not provided" },
    { label: "Company", value: candidate.currentCompany ?? "Not provided" },
    { label: "Exp", value: `${candidate.totalExperienceYrs ?? 0} yrs` },
    { label: "Source", value: formatEnumLabel(candidate.source) },
    { label: "Stage", value: STAGE_LABELS[candidate.currentStage] },
    { label: "Applied", value: formatDate(candidate.createdAt) },
  ];

  return (
    <article className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
      <h2 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase">Snapshot</h2>

      <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 xl:grid-cols-1">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[70px_1fr] items-baseline gap-1.5 text-[10px]">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
            <span className="truncate text-slate-600 font-bold" title={item.value}>{item.value}</span>
          </div>
        ))}
      </div>

      {candidate.rejection && (
        <div className="mt-2 border-t border-slate-100/80 pt-2">
          <h3 className="text-[8px] font-bold uppercase tracking-widest text-rose-500">Rejection Details</h3>
          <div className="mt-1 rounded border border-rose-100 bg-rose-50/30 p-1.5 text-[10px] leading-relaxed text-rose-700 font-medium">
            <span className="font-bold">{formatEnumLabel(candidate.rejection.category)}</span>
            <p className="mt-0.5 italic opacity-80">"{candidate.rejection.notes}"</p>
          </div>
        </div>
      )}
    </article>
  );
}
