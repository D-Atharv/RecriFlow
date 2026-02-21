import { STAGE_LABELS } from "@/lib/pipeline";
import { PIPELINE_STAGES, type Candidate, type PipelineStage } from "@/types/domain";

interface JobPipelineDistributionProps {
  candidates: Candidate[];
}

function toStageCount(candidates: Candidate[]): Record<PipelineStage, number> {
  return PIPELINE_STAGES.reduce<Record<PipelineStage, number>>((acc, stage) => {
    acc[stage] = candidates.filter((candidate) => candidate.currentStage === stage).length;
    return acc;
  }, {} as Record<PipelineStage, number>);
}

export function JobPipelineDistribution({ candidates }: JobPipelineDistributionProps) {
  const stageCount = toStageCount(candidates);

  return (
    <section className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-0.5 mb-2">
        <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">Pipeline Distribution</h2>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Active candidates</p>
      </div>

      <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-5">
        {PIPELINE_STAGES.map((stage) => (
          <article key={stage} className="rounded border border-slate-100 bg-slate-50/30 px-2.5 py-1.5 transition-all hover:bg-slate-50">
            <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none">{STAGE_LABELS[stage]}</p>
            <p className="mt-1 text-[14px] font-bold text-slate-800 leading-none">{stageCount[stage]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
