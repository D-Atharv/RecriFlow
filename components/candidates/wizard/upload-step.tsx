"use client";

import { useState, type ChangeEvent } from "react";

import type { ParsedResumeData } from "@/types/domain";

interface UploadStepProps {
  onUploaded: (resumeUrl: string, parsed: ParsedResumeData | null) => void;
}

export function UploadStep({ onUploaded }: UploadStepProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

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

  return (
    <div className="space-y-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
      <h3 className="text-base font-semibold">Step 1: Upload Resume</h3>
      <p className="text-sm text-[color:var(--color-ink-soft)]">
        PDF/DOCX up to 5MB. Parsed fields will be prefilled in the next step.
      </p>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={onFileChange}
        className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm"
      />
      {uploading ? <p className="text-sm text-[color:var(--color-ink-soft)]">Uploading and parsing...</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
