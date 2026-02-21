"use client";

import { BriefcaseBusiness, Rocket, StickyNote } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { STAGE_LABELS } from "@/lib/pipeline";
import type { Job } from "@/types/domain";

import type { CandidateDraft } from "@/components/candidates/wizard/review-step";

interface AssignStepProps {
  form: UseFormReturn<CandidateDraft>;
  jobs: Job[];
  submitting: boolean;
  submitError: string | null;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

const ENTRY_STAGE_OPTIONS: Array<{ label: string; value: CandidateDraft["initial_stage"]; helper: string }> = [
  { label: "Sourcing", value: "APPLIED", helper: "New lead" },
  { label: "Screening", value: "SCREENING", helper: "To review" },
  { label: "Interview", value: "TECHNICAL_L1", helper: "Schedule call" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-medium text-rose-600">{message}</p>;
}

export function AssignStep({ form, jobs, submitting, submitError, onBack, onSubmit }: AssignStepProps) {
  const selectedStage = form.watch("initial_stage");
  const selectedJob = jobs.find((job) => job.id === form.watch("job_id"));
  const experience = form.watch("total_experience_yrs");
  const score = form.watch("screening_fit_score");

  return (
    <section className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <header className="mb-6">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Finalize Candidate</h2>
          <p className="mt-1 text-sm text-gray-600">Step 4 of 4: assign job, entry stage, and sync-ready notes.</p>
        </header>

        <div className="space-y-5">
          <article className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                <BriefcaseBusiness className="h-4 w-4" />
              </span>
              Job Assignment
            </h3>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Select Job Opening</span>
              <select
                {...form.register("job_id")}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none transition-colors focus:border-slate-500"
              >
                <option value="">Select a job...</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
              <FieldError message={form.formState.errors.job_id?.message} />
            </label>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">Pipeline Entry Stage</p>
              <div className="grid gap-2 md:grid-cols-3">
                {ENTRY_STAGE_OPTIONS.map((stage) => {
                  const active = selectedStage === stage.value;

                  return (
                    <button
                      key={stage.value}
                      type="button"
                      onClick={() => form.setValue("initial_stage", stage.value, { shouldValidate: true })}
                      className={[
                        "rounded-lg border p-3 text-left transition-colors",
                        active ? "border-slate-900 bg-slate-50" : "border-gray-200 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <p className={["text-sm font-semibold", active ? "text-slate-900" : "text-gray-800"].join(" ")}>
                        {stage.label}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{stage.helper}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <StickyNote className="h-4 w-4" />
              </span>
              Notes for Hiring Manager
            </h3>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Recruiter Notes</span>
              <textarea
                rows={4}
                {...form.register("notes")}
                placeholder="Add context for interviewers and hiring managers."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none transition-colors focus:border-slate-500"
              />
            </label>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700">Candidate Source</span>
                <select
                  {...form.register("source")}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none transition-colors focus:border-slate-500"
                >
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="JOB_BOARD">Job Board</option>
                  <option value="AGENCY">Agency</option>
                  <option value="DIRECT_APPLICATION">Direct Application</option>
                  <option value="OTHER">Other</option>
                </select>
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700">LinkedIn URL</span>
                <input
                  {...form.register("linkedin_url")}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none transition-colors focus:border-slate-500"
                />
              </label>
            </div>
          </article>
        </div>

        {submitError ? (
          <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {submitError}
          </p>
        ) : null}

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
            disabled={submitting}
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Rocket className="h-4 w-4" />
            {submitting ? "Creating..." : "Finish & Sync"}
          </button>
        </footer>
      </div>

      <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-500">Candidate Summary</p>

        <div className="mt-4 flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-600">
            {form.watch("full_name")
              .split(" ")
              .map((part) => part.charAt(0))
              .slice(0, 2)
              .join("")
              .toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{form.watch("full_name") || "Candidate Name"}</p>
            <p className="text-sm text-gray-500">{form.watch("current_role") || "Role pending"}</p>
          </div>
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-gray-500">Experience</dt>
            <dd className="font-medium text-gray-800">{experience ? `${experience} years` : "-"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-500">Job</dt>
            <dd className="text-right font-medium text-gray-800">{selectedJob?.title ?? "Not assigned"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-500">Entry Stage</dt>
            <dd className="font-medium text-gray-800">{STAGE_LABELS[selectedStage]}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-gray-500">Screening Score</dt>
            <dd className="font-medium text-emerald-700">{score}/5</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
