"use client";

import { useFormContext } from "react-hook-form";

import type { CreateJobOpeningValues } from "@/components/jobs/new/create-job.schema";
import { OUTCOME_STAGE_LABELS, ROUND_TYPE_LABELS } from "@/lib/interview-plan";

function resolveStepLabel(step: CreateJobOpeningValues["interviewPlan"][number]): string {
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

export function HiringPipelineCard() {
  const { register, watch } = useFormContext<CreateJobOpeningValues>();
  const parsingEnabled = watch("requireResumeParsing");
  const autoReplyEnabled = watch("sendAutoReplyEmail");
  const interviewPlan = watch("interviewPlan");

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-bold text-gray-900">Automation Rules</h2>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {interviewPlan.length} steps
        </span>
      </header>

      <div className="space-y-4 px-4 py-4">
        <ol className="flex flex-wrap items-center gap-1.5">
          {interviewPlan.map((step, index) => (
            <li key={step.key} className="inline-flex items-center gap-1.5">
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border border-slate-200 bg-white px-1.5 text-[10px] font-semibold text-slate-700">
                {index + 1}
              </span>
              <span className="inline-flex h-5 items-center rounded-md border border-slate-200 bg-slate-50 px-2 text-[10px] font-medium text-slate-600">
                {resolveStepLabel(step)}
              </span>
            </li>
          ))}
        </ol>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
          <h3 className="text-xs font-semibold text-gray-900">Screening Stage Automation</h3>

          <label className="mt-4 flex items-start gap-2">
            <input
              type="checkbox"
              {...register("requireResumeParsing")}
              checked={parsingEnabled}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
            />
            <span>
              <span className="block text-xs font-medium text-gray-800">Require Resume Parsing</span>
              <span className="text-[11px] text-gray-500">Automatically extract skills and experience from uploaded files.</span>
            </span>
          </label>

          <label className="mt-3 flex items-start gap-2">
            <input
              type="checkbox"
              {...register("sendAutoReplyEmail")}
              checked={autoReplyEnabled}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
            />
            <span>
              <span className="block text-xs font-medium text-gray-800">Send Auto-Reply Email</span>
              <span className="text-[11px] text-gray-500">Acknowledge candidate application instantly after submission.</span>
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}
