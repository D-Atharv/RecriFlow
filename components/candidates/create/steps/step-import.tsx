"use client";

import { History, Link as LinkIcon, UploadCloud, Briefcase } from "lucide-react";
import { useId, useState, type ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { CandidateWizardValues } from "@/components/candidates/create/types";
import type { Job, ParsedResumeData } from "@/types/domain";

interface StepImportProps {
    form: UseFormReturn<CandidateWizardValues, any, any>;
    jobs: Job[];
    onUploaded: (resumeUrl: string, parsed: ParsedResumeData | null) => void;
    onNext: () => void;
    onCancel: () => void;
}

export function StepImport({ form, jobs, onUploaded, onNext, onCancel }: StepImportProps) {
    const inputId = useId();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/candidates/upload-resume", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const payload = (await response.json()) as { error?: string };
                throw new Error(payload.error ?? "Upload failed");
            }

            const payload = (await response.json()) as {
                resume_url: string;
                parsed: ParsedResumeData | null;
            };

            onUploaded(payload.resume_url, payload.parsed);
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const hasFile = !!form.watch("resume_url");

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold tracking-tight text-slate-900">Upload New Candidate</h1>
                    <p className="mt-1 text-[13px] text-slate-500">
                        Add a single candidate or bulk upload to start the parsing process.
                    </p>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                    <History className="h-3.5 w-3.5" />
                    View recent uploads
                </button>
            </header>

            {/* Main Card */}
            <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
                <label
                    htmlFor={inputId}
                    className={[
                        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 px-6 py-12 text-center transition-all",
                        uploading ? "opacity-50 pointer-events-none" : "hover:border-slate-400 hover:bg-slate-50",
                        hasFile && "border-emerald-200 bg-emerald-50/30",
                    ].join(" ")}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                        <UploadCloud className="h-6 w-6" />
                    </div>
                    <div className="mt-4 space-y-1">
                        <p className="text-[15px] font-semibold text-slate-900">
                            <span className="text-slate-900">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[12px] text-slate-400">PDF, DOCX, TXT or RTF (MAX. 10MB)</p>
                        {error ? <p className="text-[12px] font-semibold text-rose-600">{error}</p> : null}
                        {form.formState.errors.resume_url && (
                            <p className="text-[12px] font-semibold text-rose-600">{form.formState.errors.resume_url.message}</p>
                        )}
                    </div>
                    <input id={inputId} type="file" accept=".pdf,.docx,.txt,.rtf" onChange={onFileChange} className="sr-only" />
                </label>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-100" />
                    </div>
                    <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span className="bg-white px-3">Or enter manually</span>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-slate-700">LinkedIn URL</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-slate-500 transition-colors">
                                <LinkIcon className="h-3.5 w-3.5" />
                            </div>
                            <input
                                {...form.register("linkedin_url")}
                                placeholder="linkedin.com/in/username"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-slate-700">Portfolio / Personal Site</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-slate-500 transition-colors">
                                <LinkIcon className="h-3.5 w-3.5" />
                            </div>
                            <input
                                {...form.register("portfolio_url")}
                                placeholder="https://"
                                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5 placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-3">
                        <div>
                            <h3 className="text-[14px] font-bold text-slate-900">Assign to a job (Optional)</h3>
                            <p className="text-[12px] text-slate-500">
                                If selected, we will automatically check the candidate against job requirements.
                            </p>
                        </div>
                        <select
                            {...form.register("job_id")}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-500/5"
                        >
                            <option value="">Select an open role...</option>
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <footer className="mt-2 flex items-center justify-between border-t border-slate-100 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-[13px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className={[
                        "inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-slate-800",
                    ].join(" ")}
                    disabled={!hasFile || uploading}
                >
                    Next Step
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </footer>
        </div>
    );
}
