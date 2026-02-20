"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ROUND_TYPES, type User } from "@/types/domain";

interface ScheduleRoundFormProps {
  candidateId: string;
  interviewers: User[];
}

const ScheduleRoundFormSchema = z.object({
  round_type: z.enum(ROUND_TYPES),
  interviewer_id: z.string().trim().min(1, "Interviewer is required."),
  scheduled_at: z.string().trim().optional(),
});

type ScheduleRoundFormValues = z.infer<typeof ScheduleRoundFormSchema>;

const defaultValues: ScheduleRoundFormValues = {
  round_type: "SCREENING",
  interviewer_id: "",
  scheduled_at: "",
};

export function ScheduleRoundForm({ candidateId, interviewers }: ScheduleRoundFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ScheduleRoundFormValues>({
    resolver: zodResolver(ScheduleRoundFormSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/candidates/${candidateId}/rounds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          round_type: values.round_type,
          interviewer_id: values.interviewer_id,
          scheduled_at: values.scheduled_at ? new Date(values.scheduled_at).toISOString() : null,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to schedule round");
      }

      form.reset(defaultValues);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to schedule round");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
      <h4 className="text-sm font-semibold">Schedule Next Round</h4>

      <label className="block space-y-1 text-sm">
        <span>Round Type</span>
        <select {...form.register("round_type")} className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2">
          {ROUND_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1 text-sm">
        <span>Interviewer</span>
        <select {...form.register("interviewer_id")} className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2">
          <option value="">Select interviewer...</option>
          {interviewers.map((interviewer) => (
            <option key={interviewer.id} value={interviewer.id}>
              {interviewer.fullName}
            </option>
          ))}
        </select>
        {form.formState.errors.interviewer_id ? (
          <p className="text-xs text-rose-700">{form.formState.errors.interviewer_id.message}</p>
        ) : null}
      </label>

      <label className="block space-y-1 text-sm">
        <span>Scheduled Date</span>
        <input type="datetime-local" {...form.register("scheduled_at")} className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2" />
      </label>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-xs font-semibold text-white disabled:opacity-70"
      >
        {submitting ? "Scheduling..." : "Create Round"}
      </button>
    </form>
  );
}
