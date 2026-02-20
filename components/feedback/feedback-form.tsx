"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { RECOMMENDATIONS, REJECTION_CATEGORIES } from "@/types/domain";
import { SubmitFeedbackSchema, type SubmitFeedbackSchemaInput } from "@/types/schemas";

interface FeedbackFormProps {
  candidateId: string;
  roundId: string;
  roundType: string;
  candidateName: string;
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

export function FeedbackForm({ candidateId, roundId, roundType, candidateName }: FeedbackFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SubmitFeedbackSchemaInput>({
    resolver: zodResolver(SubmitFeedbackSchema),
    defaultValues,
    shouldUnregister: true,
  });

  const recommendation = form.watch("recommendation");

  const isRejection = useMemo(
    () => ["NO", "STRONG_NO"].includes(recommendation),
    [recommendation],
  );

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

      router.push(`/candidates/${candidateId}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-xl border border-[color:var(--color-border)] bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold">Feedback for {candidateName}</h2>
        <p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">Round: {roundType}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        <label className="space-y-1 text-sm">
          <span>Technical</span>
          <input type="number" min={1} max={5} {...form.register("technical_rating", { valueAsNumber: true })} className="w-full rounded-lg border border-[color:var(--color-border)] px-2 py-2" />
          {form.formState.errors.technical_rating ? <p className="text-xs text-rose-700">{form.formState.errors.technical_rating.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Communication</span>
          <input type="number" min={1} max={5} {...form.register("communication_rating", { valueAsNumber: true })} className="w-full rounded-lg border border-[color:var(--color-border)] px-2 py-2" />
          {form.formState.errors.communication_rating ? <p className="text-xs text-rose-700">{form.formState.errors.communication_rating.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Problem Solving</span>
          <input type="number" min={1} max={5} {...form.register("problem_solving_rating", { valueAsNumber: true })} className="w-full rounded-lg border border-[color:var(--color-border)] px-2 py-2" />
          {form.formState.errors.problem_solving_rating ? <p className="text-xs text-rose-700">{form.formState.errors.problem_solving_rating.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Culture Fit</span>
          <input type="number" min={1} max={5} {...form.register("culture_fit_rating", { valueAsNumber: true })} className="w-full rounded-lg border border-[color:var(--color-border)] px-2 py-2" />
          {form.formState.errors.culture_fit_rating ? <p className="text-xs text-rose-700">{form.formState.errors.culture_fit_rating.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Overall</span>
          <input type="number" min={1} max={5} {...form.register("overall_rating", { valueAsNumber: true })} className="w-full rounded-lg border border-[color:var(--color-border)] px-2 py-2" />
          {form.formState.errors.overall_rating ? <p className="text-xs text-rose-700">{form.formState.errors.overall_rating.message}</p> : null}
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span>Strengths</span>
        <textarea rows={4} {...form.register("strengths_text")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        {form.formState.errors.strengths_text ? <p className="text-xs text-rose-700">{form.formState.errors.strengths_text.message}</p> : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span>Improvements</span>
        <textarea rows={4} {...form.register("improvement_text")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        {form.formState.errors.improvement_text ? <p className="text-xs text-rose-700">{form.formState.errors.improvement_text.message}</p> : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span>Recommendation</span>
        <select {...form.register("recommendation")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2">
          {RECOMMENDATIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {form.formState.errors.recommendation ? <p className="text-xs text-rose-700">{form.formState.errors.recommendation.message}</p> : null}
      </label>

      {isRejection ? (
        <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-semibold text-rose-700">Rejection details required</p>

          <label className="block space-y-1 text-sm">
            <span>Rejection Category</span>
            <select {...form.register("rejection.category")} className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2">
              {REJECTION_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {form.formState.errors.rejection?.category ? (
              <p className="text-xs text-rose-700">{form.formState.errors.rejection.category.message}</p>
            ) : null}
          </label>

          <label className="block space-y-1 text-sm">
            <span>Rejection Notes</span>
            <textarea rows={4} {...form.register("rejection.notes")} className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2" />
            {form.formState.errors.rejection?.notes ? (
              <p className="text-xs text-rose-700">{form.formState.errors.rejection.notes.message}</p>
            ) : null}
          </label>
        </div>
      ) : null}

      {form.formState.errors.rejection && !isRejection ? (
        <p className="text-xs text-rose-700">{form.formState.errors.rejection.message as string}</p>
      ) : null}

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <button type="submit" disabled={submitting} className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
