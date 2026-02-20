"use client";

import type { UseFormReturn } from "react-hook-form";

import type { CandidateSource } from "@/types/domain";

export interface CandidateDraft {
  full_name: string;
  email: string;
  phone: string;
  current_role: string;
  current_company: string;
  total_experience_yrs: string;
  skills: string;
  resume_url: string;
  resume_raw_text: string;
  linkedin_url: string;
  source: CandidateSource;
  job_id: string;
  notes: string;
}

interface ReviewStepProps {
  form: UseFormReturn<CandidateDraft>;
  onNext: () => Promise<void>;
}

export function ReviewStep({ form, onNext }: ReviewStepProps) {
  return (
    <div className="space-y-4 rounded-xl border border-[color:var(--color-border)] bg-white p-5">
      <h3 className="text-base font-semibold">Step 2: Review Parsed Data</h3>
      <p className="text-sm text-[color:var(--color-ink-soft)]">Correct any field before creating the candidate.</p>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Full Name</span>
          <input {...form.register("full_name")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
          {form.formState.errors.full_name ? <p className="text-xs text-rose-700">{form.formState.errors.full_name.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Email</span>
          <input {...form.register("email")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
          {form.formState.errors.email ? <p className="text-xs text-rose-700">{form.formState.errors.email.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Phone</span>
          <input {...form.register("phone")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Current Role</span>
          <input {...form.register("current_role")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Current Company</span>
          <input {...form.register("current_company")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        </label>

        <label className="space-y-1 text-sm">
          <span>Total Experience (years)</span>
          <input {...form.register("total_experience_yrs")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
          {form.formState.errors.total_experience_yrs ? (
            <p className="text-xs text-rose-700">{form.formState.errors.total_experience_yrs.message}</p>
          ) : null}
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span>Skills (comma-separated)</span>
        <input {...form.register("skills")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        {form.formState.errors.skills ? <p className="text-xs text-rose-700">{form.formState.errors.skills.message}</p> : null}
      </label>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-strong)]"
        >
          Continue to Assignment
        </button>
      </div>
    </div>
  );
}
