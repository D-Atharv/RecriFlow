"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { RECOMMENDATIONS } from "@/types/domain";
import { SubmitFeedbackSchema, type SubmitFeedbackSchemaInput } from "@/types/schemas";

import { formatEnumLabel } from "@/components/candidates/detail/candidate-detail.utils";
import { RatingPillInput } from "@/components/feedback/form/rating-pill-input";
import { RejectionDetailsCard } from "@/components/feedback/form/rejection-details-card";

interface FeedbackFormProps {
  candidateId: string;
  roundId: string;
  roundType: string;
  candidateName: string;
  onSuccess?: () => void;
}

const defaultValues: SubmitFeedbackSchemaInput = {
  technical_rating: 3,
  communication_rating: 3,
  problem_solving_rating: 3,
  culture_fit_rating: 3,
  overall_rating: 3,
  strengths_text: "",
  improvement_text: "",
  recommendation: "YES",
};

const ratingFields: Array<{ key: keyof Pick<SubmitFeedbackSchemaInput, "technical_rating" | "communication_rating" | "problem_solving_rating" | "culture_fit_rating" | "overall_rating">; label: string }> = [
  { key: "technical_rating", label: "Technical" },
  { key: "communication_rating", label: "Communication" },
  { key: "problem_solving_rating", label: "Problem Solving" },
  { key: "culture_fit_rating", label: "Culture Fit" },
  { key: "overall_rating", label: "Overall" },
];

export function FeedbackForm({ candidateId, roundId, roundType, candidateName, onSuccess }: FeedbackFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SubmitFeedbackSchemaInput>({
    resolver: zodResolver(SubmitFeedbackSchema),
    defaultValues,
    shouldUnregister: true,
  });

  const recommendation = form.watch("recommendation");
  const rejectionCategory = form.watch("rejection.category");
  const rejectionNotes = form.watch("rejection.notes") ?? "";

  const isRejection = useMemo(() => ["NO", "STRONG_NO"].includes(recommendation), [recommendation]);
  const rejectionReady = !isRejection || (Boolean(rejectionCategory) && rejectionNotes.trim().length >= 20);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates/${candidateId}/rounds/${roundId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const responsePayload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(responsePayload.error ?? "Failed to submit feedback");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/candidates/${candidateId}`);
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-[18px] font-semibold tracking-tight text-slate-900 line-clamp-1">Interview Feedback</h2>
        <p className="text-[12px] text-slate-500 font-medium">
          Provide your feedback for the {formatEnumLabel(roundType)} round for {candidateName}.
        </p>
      </header>

      <section className="space-y-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
        <h3 className="text-[13px] font-semibold text-slate-900">Skill Assessment</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ratingFields.map((field) => (
            <RatingPillInput
              key={field.key}
              label={field.label}
              value={form.watch(field.key)}
              onChange={(value) => form.setValue(field.key, value, { shouldDirty: true, shouldValidate: true })}
              error={form.formState.errors[field.key]?.message}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-[12px] font-medium text-slate-700">Strengths</span>
          <textarea
            rows={5}
            {...form.register("strengths_text")}
            placeholder="What did the candidate do well?"
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-300"
          />
          {form.formState.errors.strengths_text ? (
            <p className="text-[11px] font-medium text-rose-600">{form.formState.errors.strengths_text.message}</p>
          ) : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-[12px] font-medium text-slate-700">Areas for Improvement</span>
          <textarea
            rows={5}
            {...form.register("improvement_text")}
            placeholder="Where did they struggle or lack depth?"
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-900 outline-none focus:border-slate-300"
          />
          {form.formState.errors.improvement_text ? (
            <p className="text-[11px] font-medium text-rose-600">{form.formState.errors.improvement_text.message}</p>
          ) : null}
        </label>
      </section>

      <section className="space-y-1.5">
        <label htmlFor="recommendation" className="text-[12px] font-medium text-slate-700">
          Final Decision
        </label>
        <select
          id="recommendation"
          {...form.register("recommendation")}
          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-900 outline-none focus:border-slate-300"
        >
          <option value="" disabled>Select recommendation...</option>
          {RECOMMENDATIONS.map((item) => (
            <option key={item} value={item}>
              {formatEnumLabel(item)}
            </option>
          ))}
        </select>
        {form.formState.errors.recommendation ? (
          <p className="text-[11px] font-medium text-rose-600">{form.formState.errors.recommendation.message}</p>
        ) : null}
      </section>

      {isRejection ? <RejectionDetailsCard form={form} /> : null}

      {form.formState.errors.rejection && !isRejection ? (
        <p className="text-[11px] font-medium text-rose-600">{form.formState.errors.rejection.message as string}</p>
      ) : null}

      {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

      <footer className="flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5">
        <button
          type="button"
          className="rounded-lg px-3 py-2 text-[12px] font-medium text-slate-500 transition-colors hover:text-slate-700"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          disabled={submitting || !rejectionReady}
          className="rounded-lg bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </footer>
    </form>
  );
}
