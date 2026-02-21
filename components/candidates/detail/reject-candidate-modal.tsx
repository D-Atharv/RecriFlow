"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { REJECTION_CATEGORIES } from "@/types/domain";
import { RejectCandidateSchema, type RejectCandidateSchemaInput } from "@/types/schemas";

interface RejectCandidateModalProps {
  candidateId: string;
  candidateName: string;
  appliedRole: string;
}

const defaultValues: RejectCandidateSchemaInput = {
  category: "TECHNICAL_GAP",
  notes: "",
};

function toCategoryLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function RejectCandidateModal({ candidateId, candidateName, appliedRole }: RejectCandidateModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RejectCandidateSchemaInput>({
    resolver: zodResolver(RejectCandidateSchema),
    defaultValues,
  });

  const notes = form.watch("notes");
  const canSubmit = notes.trim().length >= 20 && !submitting;

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = (): void => {
    setOpen(false);
    setError(null);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates/${candidateId}/rejection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to reject candidate");
      }

      form.reset(defaultValues);
      close();
      router.refresh();
    } catch (rejectError) {
      setError(rejectError instanceof Error ? rejectError.message : "Failed to reject candidate");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="inline-flex h-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 px-3 text-[11px] font-bold text-rose-600 transition-all hover:bg-rose-100 uppercase tracking-wider shadow-sm"
      >
        Reject
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-900/40 p-5 backdrop-blur-sm">
          <button type="button" aria-label="Close reject modal" onClick={close} className="absolute inset-0 cursor-default" />

          <form onSubmit={onSubmit} className="relative z-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
            <header className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[17px] font-bold tracking-tight text-slate-800">Reject Candidate</h3>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {candidateName} — {appliedRole}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={close}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-[12px] font-semibold text-slate-700">Rejection Category</span>
                <select
                  {...form.register("category")}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-slate-500"
                >
                  {REJECTION_CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {toCategoryLabel(item)}
                    </option>
                  ))}
                </select>
                {form.formState.errors.category ? (
                  <p className="text-[11px] font-medium text-rose-600">{form.formState.errors.category.message}</p>
                ) : null}
              </label>

              <label className="block space-y-1.5">
                <span className="text-[12px] font-semibold text-slate-700">Notes (min. 20 chars)</span>
                <textarea
                  rows={4}
                  {...form.register("notes")}
                  placeholder="Reasoning for rejection..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-slate-500"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-slate-400">{Math.max(0, 20 - notes.trim().length)} chars remaining</p>
                  {form.formState.errors.notes ? (
                    <p className="text-[11px] font-medium text-rose-600">{form.formState.errors.notes.message}</p>
                  ) : null}
                </div>
              </label>

              {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] font-medium text-rose-700 border border-rose-100">{error}</p> : null}
            </div>

            <footer className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="rounded-lg px-4 py-2 text-[13px] font-bold text-slate-500 transition-all hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-lg bg-rose-600 px-5 py-2 text-[13px] font-bold text-white transition-all hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Rejecting..." : "Reject Candidate"}
              </button>
            </footer>
          </form>
        </div>
      ) : null}
    </>
  );
}
