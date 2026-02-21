"use client";

import { MessageSquare, Sparkles, ShieldCheck } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { CandidateWizardValues } from "../types";

interface StepScreeningProps {
    form: UseFormReturn<CandidateWizardValues, any, any>;
    onNext: () => void;
    onBack: () => void;
}

const PROFICIENCY_LEVELS = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" },
];

export function StepScreening({ form, onNext, onBack }: StepScreeningProps) {
    const currentRating = form.watch("skill_proficiency");
    const notesLength = form.watch("assessment_notes")?.length || 0;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold tracking-tight text-slate-900">Candidate Screening Assessment</h1>
                    <p className="mt-1 text-[13px] text-slate-500">
                        Fill out the initial quick screen to qualify this candidate for the pipeline.
                    </p>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600 border border-amber-100">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Draft
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] items-start">
                <div className="flex flex-col gap-6">
                    {/* Section 1: Initial Assessment */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                                <MessageSquare className="h-4 w-4" />
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-900">Initial Assessment</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[12px] font-semibold text-slate-700">
                                Assessment Notes <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <textarea
                                    {...form.register("assessment_notes")}
                                    placeholder="Enter your initial impressions, key strengths, and potential concerns..."
                                    className="w-full min-h-[160px] rounded-xl border border-slate-200 bg-white p-4 text-[13px] outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 placeholder:text-slate-300 resize-none"
                                />
                                <div className="absolute bottom-3 right-4 text-[10px] font-bold tracking-wider text-slate-400">
                                    {notesLength}/500
                                </div>
                            </div>
                            {form.formState.errors.assessment_notes && (
                                <p className="text-[11px] font-semibold text-rose-600">{form.formState.errors.assessment_notes.message}</p>
                            )}
                            <p className="text-[11px] text-slate-400">Visible to hiring managers only.</p>
                        </div>
                    </section>

                    {/* Section 2: Skill Proficiency Match */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-900">Skill Proficiency Match</h3>
                        </div>

                        <p className="text-[12px] font-semibold text-slate-700 mb-6">
                            How well does the candidate match the core technical requirements? <span className="text-rose-500">*</span>
                        </p>

                        <div className="flex justify-between max-w-lg mx-auto mb-2">
                            {PROFICIENCY_LEVELS.map((level) => {
                                const isActive = currentRating === level.value;
                                return (
                                    <div key={level.value} className="flex flex-col items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => form.setValue("skill_proficiency", level.value)}
                                            className={[
                                                "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                                                isActive
                                                    ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-110"
                                                    : "border-slate-100 bg-white text-slate-400 hover:border-slate-200",
                                            ].join(" ")}
                                        >
                                            <span className="text-[15px] font-bold">{level.value}</span>
                                        </button>
                                        <span className={["text-[11px] font-bold tracking-tight", isActive ? "text-slate-900" : "text-slate-400"].join(" ")}>
                                            {level.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Section 3: Basic Eligibility */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-900">Basic Eligibility</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[12px] text-slate-500">Confirm the following mandatory requirements:</p>

                            <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30 cursor-pointer transition-colors hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={form.watch("work_authorization")}
                                    onChange={(e) => form.setValue("work_authorization", e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                />
                                <div className="space-y-0.5">
                                    <p className="text-[13px] font-bold text-slate-800">Work Authorization</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Candidate is authorized to work in the country of employment without sponsorship.
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30 cursor-pointer transition-colors hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={form.watch("meets_experience")}
                                    onChange={(e) => form.setValue("meets_experience", e.target.checked)}
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                                />
                                <div className="space-y-0.5">
                                    <p className="text-[13px] font-bold text-slate-800">Experience Match</p>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Candidate meets the minimum years of experience and core skill requirements.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Footer Navigation */}
                    <footer className="mt-2 flex items-center justify-between border-t border-slate-100 pt-6">
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            <svg className="h-4 w-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={onNext}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:transform active:scale-95"
                        >
                            Next Step
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </footer>
                </div>

                {/* Right Aside: AI Insight */}
                <div className="sticky top-24">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900 mb-4">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>AI Insight</span>
                        </div>
                        <p className="text-[13px] leading-relaxed text-slate-700">
                            Based on the parsed resume, this candidate shows a <span className="font-bold text-slate-900">85% match</span> for Senior roles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
