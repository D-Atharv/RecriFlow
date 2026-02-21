"use client";

import { BriefcaseBusiness, Sparkles, UserRound } from "lucide-react";
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
  portfolio_url: string;
  source: CandidateSource;
  job_id: string;
  notes: string;
  screening_notes: string;
  meets_experience_requirement: "YES" | "NO";
  work_authorization: "YES" | "NO";
  screening_fit_score: "1" | "2" | "3" | "4" | "5";
  initial_stage: "APPLIED" | "SCREENING" | "TECHNICAL_L1";
}

interface ReviewStepProps {
  form: UseFormReturn<CandidateDraft>;
  onBack: () => void;
  onNext: () => Promise<void>;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs font-medium text-rose-600">{message}</p>;
}

export function ReviewStep({ form, onBack, onNext }: ReviewStepProps) {
  const resumeUrl = form.watch("resume_url");

  return (
    <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
        <header className="mb-6">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Review Parsed Details</h2>
          <p className="mt-1 text-sm text-gray-600">Verify extracted information and correct any parser mistakes.</p>
        </header>

        <div className="space-y-5">
          <article className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                <UserRound className="h-4 w-4" />
              </span>
              Personal Information
            </h3>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1 text-sm md:col-span-2">
                <span className="font-medium text-gray-700">Full Name</span>
                <input
                  {...form.register("full_name")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-slate-500"
                />
                <FieldError message={form.formState.errors.full_name?.message} />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700">Email Address</span>
                <input
                  {...form.register("email")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-slate-500"
                />
                <FieldError message={form.formState.errors.email?.message} />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700">Phone Number</span>
                <input
                  {...form.register("phone")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-slate-500"
                />
              </label>
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <BriefcaseBusiness className="h-4 w-4" />
              </span>
              Professional Summary
            </h3>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700">Current Role</span>
                <input
                  {...form.register("current_role")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-slate-500"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700">Current Company</span>
                <input
                  {...form.register("current_company")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-slate-500"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium text-gray-700">Years of Experience</span>
                <input
                  {...form.register("total_experience_yrs")}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-slate-500"
                />
                <FieldError message={form.formState.errors.total_experience_yrs?.message} />
              </label>
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-gray-900">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                <Sparkles className="h-4 w-4" />
              </span>
              Skills & Keywords
            </h3>

            <label className="space-y-1 text-sm">
              <span className="font-medium text-gray-700">Skills (comma-separated)</span>
              <input
                {...form.register("skills")}
                placeholder="React, TypeScript, Node.js"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-900 outline-none transition-colors focus:border-slate-500"
              />
              <FieldError message={form.formState.errors.skills?.message} />
            </label>
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
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Continue to Screening
          </button>
        </footer>
      </div>

      <aside className="rounded-2xl border border-gray-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-gray-500">Original Resume</p>
          <a
            href={resumeUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-900 hover:underline"
          >
            Open
          </a>
        </div>
        <div className="p-4">
          {resumeUrl ? (
            <iframe
              src={resumeUrl}
              title="Candidate resume preview"
              className="h-[760px] w-full rounded-lg border border-gray-200"
            />
          ) : (
            <div className="flex h-[760px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500">
              Upload a resume to preview the original document.
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}
