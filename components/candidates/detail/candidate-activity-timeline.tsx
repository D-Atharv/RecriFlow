import type { ComponentType } from "react";
import { ArrowRightLeft, CalendarDays, CheckCircle2, Mail, UserPlus2, XCircle } from "lucide-react";

import type { Candidate } from "@/types/domain";

import { buildCandidateActivity, formatDateTime, type CandidateActivityKind } from "@/components/candidates/detail/candidate-detail.utils";

interface CandidateActivityTimelineProps {
  candidate: Candidate;
}

function getActivityStyles(kind: CandidateActivityKind): { icon: ComponentType<{ className?: string }>; iconTone: string } {
  switch (kind) {
    case "application":
      return { icon: UserPlus2, iconTone: "text-slate-500" };
    case "round_scheduled":
      return { icon: CalendarDays, iconTone: "text-slate-600" };
    case "feedback_submitted":
      return { icon: Mail, iconTone: "text-slate-900" };
    case "stage_updated":
      return { icon: ArrowRightLeft, iconTone: "text-emerald-600" };
    case "rejected":
      return { icon: XCircle, iconTone: "text-rose-600" };
    default:
      return { icon: CheckCircle2, iconTone: "text-slate-500" };
  }
}

export function CandidateActivityTimeline({ candidate }: CandidateActivityTimelineProps) {
  const activityItems = buildCandidateActivity(candidate).slice(0, 7);

  return (
    <article className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold tracking-widest text-slate-900 uppercase">Activity Timeline</h3>
      </div>

      {activityItems.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No activity recorded.</p>
      ) : (
        <ol className="relative mt-2.5 space-y-2 border-l border-slate-100 pl-3">
          {activityItems.map((item) => {
            const { icon: Icon, iconTone } = getActivityStyles(item.kind);

            return (
              <li key={item.id} className="relative">
                <span className="absolute -left-[19.5px] top-0 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                  <Icon className={["h-2.5 w-2.5", iconTone].join(" ")} />
                </span>

                <p className="text-[10.5px] font-bold tracking-tight text-slate-800 leading-tight">{item.title}</p>
                <p className="mt-0.5 text-[10px] font-semibold text-slate-500 leading-tight">{item.description}</p>
                <p className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-300">{formatDateTime(item.timestamp)}</p>
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}
