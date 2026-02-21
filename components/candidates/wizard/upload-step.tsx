"use client";

import { Link as LinkIcon, UploadCloud } from "lucide-react";
import { useId, useState, type ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { ParsedResumeData } from "@/types/domain";

import type { CandidateDraft } from "@/components/candidates/wizard/review-step";

interface UploadStepProps {
  form: UseFormReturn<CandidateDraft>;
  onUploaded: (resumeUrl: string, parsed: ParsedResumeData | null) => void;
}

export function UploadStep({ form, onUploaded }: UploadStepProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError(null);
    setFileName(file.name);

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

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Upload New Candidate</h2>
          <p className="mt-1 text-sm text-gray-600">Add a resume to start extraction, then verify details in the next step.</p>
        </div>
        <button type="button" className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          View recent uploads
        </button>
      </header>

      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/30 px-6 py-14 text-center transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-800">
          <UploadCloud className="h-8 w-8" />
        </span>
        <p className="mt-4 text-lg font-semibold text-gray-900">
          <span className="text-slate-900">Click to upload</span> or drag and drop
        </p>
        <p className="mt-1 text-sm text-gray-500">PDF, DOCX (Max 5MB)</p>

        <input id={inputId} type="file" accept=".pdf,.docx" onChange={onFileChange} className="sr-only" />
      </label>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">LinkedIn URL</span>
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...form.register("linkedin_url")}
              placeholder="linkedin.com/in/username"
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 outline-none transition-colors focus:border-slate-500"
            />
          </div>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Portfolio / Personal Site</span>
          <div className="relative">
            <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...form.register("portfolio_url")}
              placeholder="https://"
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 outline-none transition-colors focus:border-slate-500"
            />
          </div>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        {fileName ? <p className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700">Selected: {fileName}</p> : null}
        {uploading ? <p className="font-medium text-slate-900">Parsing in progress...</p> : null}
        {error ? <p className="font-medium text-rose-700">{error}</p> : null}
      </div>
    </section>
  );
}
