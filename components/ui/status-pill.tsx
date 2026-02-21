import type { PipelineStage } from "@/types/domain";
import { STAGE_LABELS } from "@/lib/pipeline";

interface StatusPillProps {
  stage: PipelineStage;
}

const toneMap: Record<PipelineStage, string> = {
  APPLIED: "bg-slate-100 text-slate-700",
  SCREENING: "bg-slate-100 text-slate-600",
  TECHNICAL_L1: "bg-slate-100 text-slate-700",
  TECHNICAL_L2: "bg-slate-100 text-slate-800",
  SYSTEM_DESIGN: "bg-slate-100 text-slate-900",
  HR: "bg-slate-200 text-slate-900",
  OFFER: "bg-emerald-100 text-emerald-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-rose-100 text-rose-700",
  WITHDRAWN: "bg-amber-100 text-amber-700",
};

export function StatusPill({ stage }: StatusPillProps) {
  return (
    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${toneMap[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}
