import { useMemo } from "react";
import type { PipelineStage, InterviewPlanStep } from "@/types/domain";

interface CandidateStageRailProps {
  currentStage: PipelineStage;
  interviewPlan: InterviewPlanStep[];
}

export function CandidateStageRail({ currentStage, interviewPlan }: CandidateStageRailProps) {
  // Construct the dynamic progression from the interview plan
  const progression = useMemo(() => {
    const steps = [
      { id: "APPLIED" as PipelineStage, label: "Applied" },
      ...interviewPlan.map(step => ({
        id: (step.roundType || step.outcomeStage || step.key) as PipelineStage,
        label: step.label
      }))
    ];
    return steps;
  }, [interviewPlan]);

  const currentIndex = useMemo(() => {
    // Attempt to find the index based on roundType or outcomeStage match
    const index = progression.findIndex(p => p.id === currentStage);
    return index >= 0 ? index : 0;
  }, [progression, currentStage]);

  return (
    <div className="relative w-full overflow-hidden">
      <ol className="flex w-full items-center justify-between">
        {progression.map((stage, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;

          return (
            <li key={index} className="relative flex flex-1 flex-col items-center group">
              {/* Connector Line */}
              {index < progression.length - 1 && (
                <div
                  className={[
                    "absolute left-[50%] top-2.5 h-px w-full -translate-y-1/2 transition-colors duration-500",
                    complete ? "bg-slate-400" : "bg-slate-100"
                  ].join(" ")}
                  style={{ width: 'calc(100% - 1rem)', marginLeft: '0.5rem' }}
                />
              )}

              {/* Step Circle */}
              <div
                className={[
                  "relative z-10 flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold transition-all duration-300 shadow-sm",
                  complete
                    ? "border-slate-800 bg-slate-800 text-white"
                    : current
                      ? "border-slate-800 bg-white text-slate-800 ring-4 ring-slate-50"
                      : "border-slate-200 bg-white text-slate-300 group-hover:border-slate-300",
                ].join(" ")}
              >
                {index + 1}
              </div>

              {/* Label */}
              <span
                className={[
                  "mt-1 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-300",
                  current ? "text-slate-800" : complete ? "text-slate-500" : "text-slate-300",
                ].join(" ")}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
