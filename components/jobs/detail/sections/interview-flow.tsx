"use client";

import { ArrowRight } from "lucide-react";

import { getDefaultInterviewPlan, OUTCOME_STAGE_LABELS, ROUND_TYPE_LABELS } from "@/lib/interview-plan";
import type { InterviewPlanStep, Job } from "@/types/domain";

interface InterviewFlowProps {
  job: Job;
}

function resolveLabel(step: InterviewPlanStep): string {
  if (step.label.trim().length > 0) {
    return step.label.trim();
  }

  if (step.kind === "ROUND" && step.roundType) {
    return ROUND_TYPE_LABELS[step.roundType];
  }

  if (step.kind === "OUTCOME" && step.outcomeStage) {
    return OUTCOME_STAGE_LABELS[step.outcomeStage];
  }

  return "Step";
}

function resolvePlan(job: Job): InterviewPlanStep[] {
  if (Array.isArray(job.interviewPlan) && job.interviewPlan.length > 0) {
    return job.interviewPlan;
  }

  return getDefaultInterviewPlan();
}

export function InterviewFlow({ job }: InterviewFlowProps) {
  const plan = resolvePlan(job);

  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 leading-none">Interview Flow</h3>
        <p className="text-[10px] font-medium text-slate-400">{plan.length} configured steps</p>
      </div>

      <ol className="flex flex-wrap items-center gap-1.5">
        {plan.map((step, index) => (
          <li key={step.key} className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-700">
              {index + 1}
            </span>
            <span
              className={[
                "inline-flex h-5 items-center rounded-md border px-2 text-[10px] font-semibold uppercase tracking-wide",
                step.kind === "OUTCOME"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-600",
              ].join(" ")}
            >
              {resolveLabel(step)}
            </span>
            {index < plan.length - 1 ? <ArrowRight className="h-3 w-3 text-slate-300" /> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
