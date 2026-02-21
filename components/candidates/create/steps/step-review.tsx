"use client";

import { Info, Plus, X, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import type { KeyboardEvent, SVGProps } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CandidateWizardValues } from "../types";

interface StepReviewProps {
    form: UseFormReturn<CandidateWizardValues, any, any>;
    onNext: () => void;
    onBack: () => void;
}

export function StepReview({ form, onNext, onBack }: StepReviewProps) {
    const skills = form.watch("skills") || [];

    const handleAddSkill = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !skills.includes(value)) {
                form.setValue("skills", [...skills, value]);
                e.currentTarget.value = "";
            }
        }
    };

    const removeSkill = (skillToRemove: string) => {
        form.setValue("skills", skills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold tracking-tight text-slate-900">Review Parsed Details</h1>
                    <p className="mt-1 text-[13px] text-slate-500">
                        Verify extracted information for <span className="font-semibold text-slate-900">{form.watch("full_name") || "Candidate"}</span>.
                    </p>
                </div>
                <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
                >
                    Save as Draft
                </button>
            </header>

            {/* Two Column Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
                {/* Left: Form Sections */}
                <div className="flex flex-col gap-6">
                    {/* Personal Info */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                                <Info className="h-4 w-4" />
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-900">Personal Information</h3>
                        </div>

                        <div className="grid gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-semibold text-slate-700">Full Name</label>
                                <input
                                    {...form.register("full_name")}
                                    className={[
                                        "w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none transition-all focus:ring-4 focus:ring-slate-500/5",
                                        form.formState.errors.full_name ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-slate-500",
                                    ].join(" ")}
                                />
                                {form.formState.errors.full_name && (
                                    <p className="text-[11px] font-semibold text-rose-600">{form.formState.errors.full_name.message}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-semibold text-slate-700">Email Address</label>
                                    <input
                                        {...form.register("email")}
                                        className={[
                                            "w-full rounded-lg border bg-white px-3 py-2 text-[13px] outline-none transition-all focus:ring-4 focus:ring-slate-500/5",
                                            form.formState.errors.email ? "border-rose-300 focus:border-rose-400" : "border-slate-200 focus:border-slate-500",
                                        ].join(" ")}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-[11px] font-semibold text-rose-600">{form.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[12px] font-semibold text-slate-700">Phone Number</label>
                                    <input
                                        {...form.register("phone")}
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Professional Summary */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                                <BriefcaseIcon className="h-3.5 w-3.5" />
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-900">Professional Summary</h3>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-semibold text-slate-700">Current Company</label>
                                <input
                                    {...form.register("current_company")}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-semibold text-slate-700">Total Years of Exp.</label>
                                <input
                                    {...form.register("total_experience_yrs")}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Skills & Keywords */}
                    <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                                    <span className="text-[10px] font-bold">SK</span>
                                </div>
                                <h3 className="text-[15px] font-bold text-slate-900">Skills & Keywords</h3>
                            </div>
                            <button type="button" className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:text-slate-700">
                                <Plus className="h-3 w-3" />
                                Add Skill
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <div
                                    key={skill}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-[12px] font-bold text-slate-800"
                                >
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)}>
                                        <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
                                    </button>
                                </div>
                            ))}
                            <input
                                placeholder="Type to add..."
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-1.5 text-[12px] outline-none focus:bg-white focus:border-slate-200 transition-all min-w-[120px]"
                                onKeyDown={handleAddSkill}
                            />
                        </div>
                        {form.formState.errors.skills && (
                            <p className="mt-2 text-[11px] font-semibold text-rose-600">{form.formState.errors.skills.message}</p>
                        )}
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

                {/* Right: Resume Preview */}
                <div className="sticky top-24 h-[calc(100vh-140px)] min-h-[600px] flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Original Resume</span>
                        <div className="flex items-center gap-3">
                            <button type="button" className="hover:text-slate-600 transition-colors"><ZoomOut className="h-4 w-4" /></button>
                            <button type="button" className="hover:text-slate-600 transition-colors"><ZoomIn className="h-4 w-4" /></button>
                            <button type="button" className="hover:text-slate-600 transition-colors border-l border-slate-200 pl-3"><Maximize2 className="h-4 w-4" /></button>
                        </div>
                    </div>
                    <div className="flex-1 rounded-2xl border border-slate-200/60 bg-slate-50 overflow-hidden relative shadow-inner">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[85%] h-[92%] bg-white shadow-2xl rounded-sm p-8 flex flex-col gap-4">
                                <div className="border-b border-slate-100 pb-4">
                                    <h2 className="text-2xl font-bold text-slate-800">Alexander Bennett</h2>
                                    <p className="text-[11px] text-slate-400 mt-1">alex.bennett@example.com | San Francisco, CA</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Experience</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between items-baseline">
                                                    <p className="text-[13px] font-bold text-slate-700">Senior Product Designer</p>
                                                    <p className="text-[10px] font-medium text-slate-400">2020 - Present</p>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500 italic">TechFlow Solutions</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex gap-2">
                                                    <div className="h-1 w-1 rounded-full bg-slate-300 mt-1.5" />
                                                    <p className="text-[11px] text-slate-500">Led design for flagship SaaS product, increasing retention by 25%.</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="h-1 w-1 rounded-full bg-slate-300 mt-1.5" />
                                                    <p className="text-[11px] text-slate-500">Managed a team of 3 junior designers.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-slate-50">
                                    <p className="text-[9px] text-slate-300 text-center">... scroll to view more ...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    );
}
