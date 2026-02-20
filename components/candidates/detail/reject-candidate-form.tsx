"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { REJECTION_CATEGORIES } from "@/types/domain";
import { RejectCandidateSchema, type RejectCandidateSchemaInput } from "@/types/schemas";

interface RejectCandidateFormProps {
  candidateId: string;
}

const defaultValues: RejectCandidateSchemaInput = {
  category: "TECHNICAL_GAP",
  notes: "",
};

export function RejectCandidateForm({ candidateId }: RejectCandidateFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RejectCandidateSchemaInput>({
    resolver: zodResolver(RejectCandidateSchema),
    defaultValues,
  });

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
      router.refresh();
    } catch (rejectError) {
      setError(rejectError instanceof Error ? rejectError.message : "Failed to reject candidate");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
      <h4 className="text-sm font-semibold text-rose-700">Reject Candidate</h4>

      <label className="block space-y-1 text-sm">
        <span>Category</span>
        <select {...form.register("category")} className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2">
          {REJECTION_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {form.formState.errors.category ? (
          <p className="text-xs text-rose-700">{form.formState.errors.category.message}</p>
        ) : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span>Notes (minimum 20 characters)</span>
        <textarea rows={4} {...form.register("notes")} className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2" />
        {form.formState.errors.notes ? (
          <p className="text-xs text-rose-700">{form.formState.errors.notes.message}</p>
        ) : null}
      </label>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-70"
      >
        {submitting ? "Rejecting..." : "Reject Candidate"}
      </button>
    </form>
  );
}
