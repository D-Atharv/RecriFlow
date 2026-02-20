import type { PipelineStage } from "@/types/domain";
import { STAGE_LABELS } from "@/lib/pipeline";

interface StatusPillProps {
  stage: PipelineStage;
}

const toneMap: Record<PipelineStage, string> = {
  APPLIED: "bg-slate-100 text-slate-700",
  SCREENING: "bg-cyan-100 text-cyan-700",
  TECHNICAL_L1: "bg-blue-100 text-blue-700",
  TECHNICAL_L2: "bg-indigo-100 text-indigo-700",
  SYSTEM_DESIGN: "bg-violet-100 text-violet-700",
  HR: "bg-fuchsia-100 text-fuchsia-700",
  OFFER: "bg-emerald-100 text-emerald-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-rose-100 text-rose-700",
  WITHDRAWN: "bg-amber-100 text-amber-700",
};

export function StatusPill({ stage }: StatusPillProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${toneMap[stage]}`}>
      {STAGE_LABELS[stage]}
    </span>
  );
}
