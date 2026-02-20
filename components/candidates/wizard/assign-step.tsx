"use client";

import type { UseFormReturn } from "react-hook-form";

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

export function AssignStep({ form, jobs, submitting, submitError, onBack, onSubmit }: AssignStepProps) {
  return (
    <div className="space-y-4 rounded-xl border border-[color:var(--color-border)] bg-white p-5">
      <h3 className="text-base font-semibold">Step 3: Assign Job and Source</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Assigned Job</span>
          <select {...form.register("job_id")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2">
            <option value="">Select a job...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          {form.formState.errors.job_id ? <p className="text-xs text-rose-700">{form.formState.errors.job_id.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Candidate Source</span>
          <select {...form.register("source")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2">
            <option value="LINKEDIN">LINKEDIN</option>
            <option value="REFERRAL">REFERRAL</option>
            <option value="JOB_BOARD">JOB_BOARD</option>
            <option value="AGENCY">AGENCY</option>
            <option value="DIRECT_APPLICATION">DIRECT_APPLICATION</option>
            <option value="OTHER">OTHER</option>
          </select>
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span>LinkedIn URL (optional)</span>
        <input {...form.register("linkedin_url")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
      </label>

      <label className="space-y-1 text-sm">
        <span>Recruiter Notes</span>
        <textarea rows={4} {...form.register("notes")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
      </label>

      {submitError ? <p className="text-sm text-rose-700">{submitError}</p> : null}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-[color:var(--color-border)] px-4 py-2 text-sm font-medium text-[color:var(--color-ink-soft)]"
        >
          Back
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
        >
          {submitting ? "Saving..." : "Create Candidate"}
        </button>
      </div>
    </div>
  );
}
