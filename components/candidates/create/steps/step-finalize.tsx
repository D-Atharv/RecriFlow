"use client";

import { Briefcase, FileText, Paperclip, Rocket, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { CandidateWizardValues } from "../types";
import type { Job } from "@/types/domain";

interface StepFinalizeProps {
    form: UseFormReturn<CandidateWizardValues, any, any>;
    jobs: Job[];
    onBack: () => void;
    onSubmit: () => void;
    submitting?: boolean;
    submitError?: string | null;
}

const PIPELINE_STAGES = [
    { id: "APPLIED", label: "Sourcing", description: "New lead" },
    { id: "SCREENING", label: "Screening", description: "To review" },
    { id: "TECHNICAL_L1", label: "Interview", description: "Schedule call" },
] as const;

export function StepFinalize({ form, jobs, onBack, onSubmit, submitting, submitError }: StepFinalizeProps) {
    const hasJobs = jobs.length > 0;
    const selectedStage = form.watch("pipeline_stage");
    const selectedJobId = form.watch("job_id");
    const fullName = form.watch("full_name") || "Jane Doe";
    const currentRole = form.watch("current_role") || "Senior Product Designer";
    const experience = form.watch("total_experience_yrs") || "7";
    const jobError = form.formState.errors.job_id?.message;
    const canSubmit = hasJobs && Boolean(selectedJobId) && !submitting;
    const needsJobSelection = hasJobs && !selectedJobId;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold tracking-tight text-slate-900">Finalize Candidate</h1>
                    <p className="mt-1 text-[13px] text-slate-500">
                        Step 4 of 4: Assign to pipeline and sync data.
                    </p>
                </div>
                <div className="text-[11px] font-bold text-slate-400">Draft Saved</div>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] items-start">
                <div className="flex flex-col gap-6">
                    {/* Section 1: Job Assignment */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <Briefcase className="h-4 w-4" />
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-900">Job Assignment</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-semibold text-slate-700">Select Job Opening</label>
                                <select
                                    {...form.register("job_id")}
                                    disabled={!hasJobs}
                                    className={[
                                        "w-full rounded-lg bg-white px-3 py-2 text-[13px] font-medium text-slate-700 outline-none transition-all focus:ring-4 focus:ring-slate-500/5 disabled:cursor-not-allowed disabled:bg-slate-100/70 disabled:text-slate-400",
                                        jobError ? "border border-rose-300 focus:border-rose-400" : "border border-slate-200 focus:border-slate-500",
                                    ].join(" ")}
                                    aria-invalid={Boolean(jobError)}
                                >
                                    <option value="">{hasJobs ? "Select a job opening..." : "No open jobs available"}</option>
                                    {jobs.map((job) => (
                                        <option key={job.id} value={job.id}>
                                            {job.title} - REQ-{job.id.slice(-4).toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {!hasJobs ? (
                                    <p className="text-[11px] font-semibold text-amber-700">
                                        Create or re-open a job first, then assign the candidate and finish sync.
                                    </p>
                                ) : jobError ? (
                                    <p className="text-[11px] font-semibold text-rose-600">{jobError}</p>
                                ) : (
                                    <p className="text-[11px] text-slate-400">The candidate will be linked to this requisition ID.</p>
                                )}
                            </div>

                            <div className="space-y-3">
                                <label className="text-[12px] font-semibold text-slate-700">Pipeline Stage</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {PIPELINE_STAGES.map((stage) => {
                                        const isActive = selectedStage === stage.id;
                                        return (
                                            <button
                                                key={stage.id}
                                                type="button"
                                                onClick={() =>
                                                    form.setValue("pipeline_stage", stage.id, {
                                                        shouldDirty: true,
                                                        shouldTouch: true,
                                                        shouldValidate: true,
                                                    })
                                                }
                                                className={[
                                                    "flex flex-col gap-1 rounded-xl border p-3 text-left transition-all",
                                                    isActive
                                                        ? "border-slate-900 bg-slate-50/30 ring-1 ring-slate-900"
                                                        : "border-slate-100 bg-white hover:border-slate-200",
                                                ].join(" ")}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={["text-[12px] font-bold", isActive ? "text-slate-900" : "text-slate-900"].join(" ")}>
                                                        {stage.label}
                                                    </span>
                                                    <div
                                                        className={[
                                                            "h-3.5 w-3.5 rounded-full border flex items-center justify-center",
                                                            isActive ? "border-slate-900 bg-slate-900" : "border-slate-200 bg-white",
                                                        ].join(" ")}
                                                    >
                                                        {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">{stage.description}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Notes */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <h3 className="text-[15px] font-bold text-slate-900">Notes</h3>
                            </div>
                            <button type="button" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-900 hover:text-slate-700">
                                <Paperclip className="h-3 w-3" />
                                Attach file
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[12px] font-semibold text-slate-700">Notes for Hiring Manager</label>
                            <textarea
                                {...form.register("manager_notes")}
                                placeholder="Add any specific context regarding this candidate's application..."
                                className="w-full min-h-[140px] rounded-xl border border-slate-200 bg-white p-4 text-[13px] outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 placeholder:text-slate-300 resize-none"
                            />
                            <p className="text-[11px] text-slate-400">Visible to admins and hiring managers only.</p>
                        </div>
                    </section>

                    {/* Footer Navigation */}
                    <footer className="mt-2 flex items-center justify-between">
                        <div className="flex flex-col gap-6 w-full lg:hidden">
                            {submitError ? (
                                <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700">
                                    {submitError}
                                </div>
                            ) : null}
                            <p className="text-center text-[11px] text-slate-400">
                                <Sparkles className="h-3 w-3 inline mr-1" />
                                Will sync to Google Sheets & Slack
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={!canSubmit}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-[14px] font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                                >
                                    <Rocket className="h-4 w-4" />
                                    Finish & Sync to Sheets
                                </button>
                                {needsJobSelection ? (
                                    <p className="text-center text-[11px] font-medium text-amber-700">
                                        Select a job opening to enable save and sync.
                                    </p>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors py-2"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </footer>
                </div>

                {/* Right Aside: Candidate Summary */}
                <div className="sticky top-24 space-y-6">
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 font-primary">Candidate Summary</h3>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 text-sm font-bold border-2 border-slate-50">
                                {fullName.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[16px] font-bold text-slate-900 truncate">{fullName}</h4>
                                <p className="text-[11px] text-slate-400 truncate">{currentRole}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[12px]">
                                <span className="text-slate-400 font-medium font-primary">Experience</span>
                                <span className="text-slate-700 font-bold">{experience} Years</span>
                            </div>
                            <div className="flex items-center justify-between text-[12px]">
                                <span className="text-slate-400 font-medium font-primary">Location</span>
                                <span className="text-slate-700 font-bold">San Francisco, CA</span>
                            </div>
                            <div className="flex items-center justify-between text-[12px]">
                                <span className="text-slate-400 font-medium font-primary">Match Score</span>
                                <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-100">
                                    92% High
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[12px]">
                                <span className="text-slate-400 font-medium font-primary">Source</span>
                                <span className="text-slate-700 font-bold">Direct Upload</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            {submitError ? (
                                <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700">
                                    {submitError}
                                </div>
                            ) : null}
                            <p className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                                <Rocket className="h-3 w-3" />
                                Will sync to Google Sheets & Slack
                            </p>
                            <div className="mt-4 flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={!canSubmit}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-[14px] font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
                                >
                                    {submitting ? "Processing..." : (
                                        <>
                                            <Rocket className="h-4 w-4" />
                                            Finish & Sync to Sheets
                                        </>
                                    )}
                                </button>
                                {needsJobSelection ? (
                                    <p className="text-[11px] font-medium text-amber-700">
                                        Select a job opening to enable save and sync.
                                    </p>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors py-2"
                                >
                                    Back
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Pipeline Tip Bubble */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-2">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Pipeline Tip</span>
                        </div>
                        <p className="text-[12px] leading-relaxed text-slate-700">
                            Candidates assigned to <span className="font-bold text-slate-900">&apos;Screening&apos;</span> stage will automatically receive an intro email sequence.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
