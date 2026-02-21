"use client";

import { CheckCircle2, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { CandidateDraft } from "@/components/candidates/wizard/review-step";

interface ScreeningStepProps {
  form: UseFormReturn<CandidateDraft>;
  onBack: () => void;
  onNext: () => Promise<void>;
}

function QuestionLabel({ title, required = true }: { title: string; required?: boolean }) {
  return (
    <p className="text-sm font-medium text-gray-700">
      {title}
      {required ? <span className="ml-1 text-rose-500">*</span> : null}
    </p>
  );
}

export function ScreeningStep({ form, onBack, onNext }: ScreeningStepProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Candidate Screening Assessment</h2>
          <p className="mt-1 text-sm text-gray-600">
            Complete mandatory checks before assigning this candidate to the pipeline.
          </p>
        </div>
        <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          Draft
        </span>
      </header>

      <div className="space-y-5">
        <article className="rounded-xl border border-gray-200 p-5">
          <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
              <ClipboardCheck className="h-4 w-4" />
            </span>
            Initial Assessment
          </h3>
          <QuestionLabel title="Assessment notes" />
          <textarea
            rows={5}
            maxLength={500}
            {...form.register("screening_notes")}
            placeholder="Enter initial impressions, key strengths, and potential concerns..."
            className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 outline-none transition-colors focus:border-slate-500"
          />
          <p className="mt-1 text-xs text-gray-500">Visible to recruiters and hiring managers.</p>
          {form.formState.errors.screening_notes ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{form.formState.errors.screening_notes.message}</p>
          ) : null}
        </article>

        <article className="rounded-xl border border-gray-200 p-5">
          <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
              <Sparkles className="h-4 w-4" />
            </span>
            Skill Proficiency Match
          </h3>
          <QuestionLabel title="How strong is the role-fit based on resume and screening?" />
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {(["1", "2", "3", "4", "5"] as const).map((score) => {
              const selected = form.watch("screening_fit_score") === score;

              return (
                <button
                  key={score}
                  type="button"
                  onClick={() => form.setValue("screening_fit_score", score, { shouldValidate: true })}
                  className={[
                    "rounded-lg border px-3 py-4 text-center transition-colors",
                    selected ? "border-slate-900 bg-slate-50 text-slate-900" : "border-gray-200 text-gray-600 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <p className="text-lg font-semibold">{score}</p>
                  <p className="mt-1 text-xs">
                    {score === "1" ? "Poor" : score === "2" ? "Fair" : score === "3" ? "Good" : score === "4" ? "Very Good" : "Excellent"}
                  </p>
                </button>
              );
            })}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 p-5">
          <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </span>
            Eligibility Check
          </h3>

          <div className="space-y-4">
            <div>
              <QuestionLabel title="Meets minimum experience requirement?" />
              <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-gray-200">
                {(["YES", "NO"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => form.setValue("meets_experience_requirement", option, { shouldValidate: true })}
                    className={[
                      "px-4 py-2 text-sm font-medium transition-colors",
                      form.watch("work_authorization") === option || form.watch("meets_experience_requirement") === option
                        ? "bg-slate-900 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <QuestionLabel title="Work authorization confirmed?" />
              <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-gray-200">
                {(["YES", "NO"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => form.setValue("work_authorization", option, { shouldValidate: true })}
                    className={[
                      "px-4 py-2 text-sm font-medium transition-colors",
                      form.watch("work_authorization") === option
                        ? "bg-slate-900 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <CheckCircle2 className="h-4 w-4" />
          Continue to Assignment
        </button>
      </footer>
    </section>
  );
}
