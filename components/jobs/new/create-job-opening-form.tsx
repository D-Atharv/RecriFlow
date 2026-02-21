"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useMemo, useState } from "react";

import {
  createJobOpeningDefaults,
  CreateJobOpeningSchema,
  type CreateJobOpeningValues,
} from "@/components/jobs/new/create-job.schema";
import { EmploymentDetailsCard } from "@/components/jobs/new/sections/employment-details-card";
import { HiringPipelineCard } from "@/components/jobs/new/sections/hiring-pipeline-card";
import { HiringTeamCard } from "@/components/jobs/new/sections/hiring-team-card";
import { InterviewPlanCard } from "@/components/jobs/new/sections/interview-plan-card";
import { JobDetailsCard } from "@/components/jobs/new/sections/job-details-card";
import { VisibilityCard } from "@/components/jobs/new/sections/visibility-card";
import { getDefaultInterviewPlan, normalizeInterviewPlan, resolveTemplateIdFromPlan } from "@/lib/interview-plan";
import type { Job, User } from "@/types/domain";

type SubmitIntent = "DRAFT" | "PUBLISH" | "SAVE";

interface BaseCreateJobOpeningFormProps {
  actorUserId: string;
  hiringTeamCandidates: User[];
}

interface CreateModeProps extends BaseCreateJobOpeningFormProps {
  mode?: "create";
}

interface EditModeProps extends BaseCreateJobOpeningFormProps {
  mode: "edit";
  job: Job;
}

type CreateJobOpeningFormProps = CreateModeProps | EditModeProps;

function parseLinesToList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function resolveInitialCoreResponsibilitiesText(editJob: Job | null): string {
  if (!editJob) {
    return createJobOpeningDefaults.coreResponsibilitiesText;
  }

  const coreResponsibilities = Array.isArray(editJob.coreResponsibilities) ? editJob.coreResponsibilities : [];
  if (coreResponsibilities.length > 0) {
    return coreResponsibilities.join("\n");
  }

  const fallback = parseLinesToList(editJob.description).slice(0, 5);
  if (fallback.length > 0) {
    return fallback.join("\n");
  }

  return createJobOpeningDefaults.coreResponsibilitiesText;
}

function resolveInitialHiringTeamIds(
  actorUserId: string,
  hiringTeamCandidates: User[],
  editJob: Job | null,
): string[] {
  const allowedIds = new Set(hiringTeamCandidates.map((member) => member.id));
  const baseIds = editJob ? [editJob.createdById, actorUserId] : [actorUserId];
  const uniqueIds = Array.from(new Set(baseIds)).filter((id) => allowedIds.has(id));

  if (uniqueIds.length > 0) {
    return uniqueIds;
  }

  const fallback = hiringTeamCandidates[0]?.id;
  return fallback ? [fallback] : [];
}

function resolveInitialInterviewPlan(job: Job | null): CreateJobOpeningValues["interviewPlan"] {
  if (!job || !Array.isArray(job.interviewPlan) || job.interviewPlan.length === 0) {
    return getDefaultInterviewPlan();
  }

  return job.interviewPlan.map((step) => ({
    key: step.key,
    label: step.label,
    kind: step.kind,
    roundType: step.roundType,
    outcomeStage: step.outcomeStage,
  }));
}

export function CreateJobOpeningForm(props: CreateJobOpeningFormProps) {
  const { actorUserId, hiringTeamCandidates } = props;
  const isEditMode = props.mode === "edit";
  const editingJob = isEditMode ? props.job : null;
  const editingJobId = editingJob?.id;
  const editingJobTitle = editingJob?.title ?? "Job";
  const router = useRouter();
  const initialValues = useMemo<CreateJobOpeningValues>(
    () => ({
      ...createJobOpeningDefaults,
      title: editingJob?.title ?? createJobOpeningDefaults.title,
      department: editingJob?.department ?? createJobOpeningDefaults.department,
      description: editingJob?.description ?? createJobOpeningDefaults.description,
      coreResponsibilitiesText: resolveInitialCoreResponsibilitiesText(editingJob),
      requiredSkillsText: editingJob?.requiredSkills.join(", ") ?? createJobOpeningDefaults.requiredSkillsText,
      experienceMin: editingJob?.experienceMin ?? createJobOpeningDefaults.experienceMin,
      experienceMax: editingJob?.experienceMax ?? createJobOpeningDefaults.experienceMax,
      hiringTeamIds: resolveInitialHiringTeamIds(actorUserId, hiringTeamCandidates, editingJob),
      interviewPlan: resolveInitialInterviewPlan(editingJob),
      interviewPlanTemplateId: editingJob ? resolveTemplateIdFromPlan(editingJob.interviewPlan) : createJobOpeningDefaults.interviewPlanTemplateId,
    }),
    [actorUserId, editingJob, hiringTeamCandidates],
  );

  const form = useForm<CreateJobOpeningValues>({
    resolver: zodResolver(CreateJobOpeningSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const [submitting, setSubmitting] = useState<SubmitIntent | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async (values: CreateJobOpeningValues, intent: SubmitIntent): Promise<void> => {
    setSubmitting(intent);
    setSubmitError(null);

    try {
      if (isEditMode && !editingJobId) {
        throw new Error("Edit job id is missing");
      }

      const response = await fetch(isEditMode ? `/api/jobs/${editingJobId}` : "/api/jobs", {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: values.title,
          department: values.department,
          description: values.description,
          core_responsibilities: parseLinesToList(values.coreResponsibilitiesText),
          required_skills: values.requiredSkillsText
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          interview_plan: normalizeInterviewPlan(values.interviewPlan),
          experience_min: values.experienceMin,
          experience_max: values.experienceMax,
          ...(!isEditMode ? { status: intent === "PUBLISH" ? "OPEN" : "ON_HOLD" } : {}),
        }),
      });

      const payload = (await response.json()) as { error?: string; issues?: Record<string, string>; job?: { id: string } };

      if (!response.ok) {
        if (payload.issues) {
          const issueMessages = Object.values(payload.issues);
          throw new Error(payload.error || `Validation failed: ${issueMessages.join(", ")}`);
        }
        throw new Error(payload.error ?? "Failed to save job");
      }

      if (!payload.job) {
        throw new Error("Invalid response while creating job");
      }

      router.push(`/jobs/${payload.job.id}`);
      router.refresh();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save job");
    } finally {
      setSubmitting(null);
    }
  };

  const handleSubmit = (intent: SubmitIntent) =>
    form.handleSubmit(
      (values) => submit(values, intent),
      () => {
        setSubmitError("Please fix the validation errors below before saving.");
      },
    )();

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-medium text-gray-500">
              Jobs &gt; {isEditMode ? editingJobTitle : "Create New"}
              {isEditMode ? " > Edit" : ""}
            </p>
            <h1 className="mt-1 text-[20px] font-semibold tracking-tight text-gray-900">
              {isEditMode ? "Edit Job Opening" : "Create New Job Opening"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Link
                  href={`/jobs/${editingJobId ?? ""}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  onClick={() => void handleSubmit("SAVE")}
                  disabled={submitting !== null}
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "SAVE" ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => void handleSubmit("DRAFT")}
                  disabled={submitting !== null}
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "DRAFT" ? "Saving..." : "Save Draft"}
                </button>
                <button
                  type="button"
                  onClick={() => void handleSubmit("PUBLISH")}
                  disabled={submitting !== null}
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting === "PUBLISH" ? "Publishing..." : "Publish Job"}
                </button>
              </>
            )}
          </div>
        </header>

        {submitError ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
            {submitError}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <JobDetailsCard />
            <InterviewPlanCard />
            <HiringPipelineCard />
          </div>

          <aside className="space-y-6">
            <EmploymentDetailsCard />
            <HiringTeamCard actorUserId={actorUserId} members={hiringTeamCandidates} />
            <VisibilityCard />
          </aside>
        </div>
      </div>
    </FormProvider>
  );
}
