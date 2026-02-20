"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const JobFormSchema = z
  .object({
    title: z.string().trim().min(2, "Title must be at least 2 characters."),
    department: z.string().trim().min(1, "Department is required."),
    description: z.string().trim().min(10, "Description must be at least 10 characters."),
    required_skills_text: z.string().trim().min(1, "Add at least one required skill."),
    experience_min: z.number().min(0),
    experience_max: z.number().min(0),
  })
  .refine((data) => data.experience_min <= data.experience_max, {
    path: ["experience_max"],
    message: "Maximum experience must be greater than or equal to minimum experience.",
  });

type JobFormValues = z.infer<typeof JobFormSchema>;

interface JobFormClientProps {
  mode?: "create";
}

const defaultValues: JobFormValues = {
  title: "",
  department: "",
  description: "",
  required_skills_text: "",
  experience_min: 0,
  experience_max: 0,
};

export function JobFormClient({ mode = "create" }: JobFormClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(JobFormSchema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          department: values.department,
          description: values.description,
          required_skills: values.required_skills_text
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          experience_min: values.experience_min,
          experience_max: values.experience_max,
          status: "OPEN",
        }),
      });

      const payload = (await response.json()) as { error?: string; job?: { id: string } };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save job");
      }

      if (!payload.job) {
        throw new Error("Invalid job response");
      }

      router.push(`/jobs/${payload.job.id}`);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save job");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-[color:var(--color-border)] bg-white p-5">
      <h3 className="text-lg font-semibold">{mode === "create" ? "Create Job" : "Job"}</h3>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Title</span>
          <input {...form.register("title")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
          {form.formState.errors.title ? <p className="text-xs text-rose-700">{form.formState.errors.title.message}</p> : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Department</span>
          <input {...form.register("department")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
          {form.formState.errors.department ? (
            <p className="text-xs text-rose-700">{form.formState.errors.department.message}</p>
          ) : null}
        </label>
      </div>

      <label className="space-y-1 text-sm">
        <span>Description</span>
        <textarea rows={5} {...form.register("description")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        {form.formState.errors.description ? (
          <p className="text-xs text-rose-700">{form.formState.errors.description.message}</p>
        ) : null}
      </label>

      <label className="space-y-1 text-sm">
        <span>Required Skills (comma-separated)</span>
        <input {...form.register("required_skills_text")} className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2" />
        {form.formState.errors.required_skills_text ? (
          <p className="text-xs text-rose-700">{form.formState.errors.required_skills_text.message}</p>
        ) : null}
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Minimum Experience</span>
          <input
            type="number"
            {...form.register("experience_min", { valueAsNumber: true })}
            className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2"
            min={0}
          />
          {form.formState.errors.experience_min ? (
            <p className="text-xs text-rose-700">{form.formState.errors.experience_min.message}</p>
          ) : null}
        </label>

        <label className="space-y-1 text-sm">
          <span>Maximum Experience</span>
          <input
            type="number"
            {...form.register("experience_max", { valueAsNumber: true })}
            className="w-full rounded-lg border border-[color:var(--color-border)] px-3 py-2"
            min={0}
          />
          {form.formState.errors.experience_max ? (
            <p className="text-xs text-rose-700">{form.formState.errors.experience_max.message}</p>
          ) : null}
        </label>
      </div>

      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
      >
        {submitting ? "Saving..." : "Save Job"}
      </button>
    </form>
  );
}
