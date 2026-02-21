"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AssignStep } from "@/components/candidates/wizard/assign-step";
import { ReviewStep, type CandidateDraft } from "@/components/candidates/wizard/review-step";
import { ScreeningStep } from "@/components/candidates/wizard/screening-step";
import { UploadStep } from "@/components/candidates/wizard/upload-step";
import { WizardProgressSidebar } from "@/components/candidates/wizard/wizard-progress-sidebar";
import type { CandidateResponse, ErrorResponse } from "@/types/api";
import { CANDIDATE_SOURCES, type Job, type ParsedResumeData } from "@/types/domain";

interface NewCandidateWizardProps {
  jobs: Job[];
}

const CandidateWizardSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must contain at least 2 characters."),
  email: z.string().trim().email("A valid email address is required."),
  phone: z.string().trim(),
  current_role: z.string().trim(),
  current_company: z.string().trim(),
  total_experience_yrs: z
    .string()
    .trim()
    .refine((value) => !value || !Number.isNaN(Number(value)), {
      message: "Experience must be a number.",
    }),
  skills: z.string().trim().min(1, "Add at least one skill."),
  resume_url: z.string().trim().min(1, "Resume upload is required."),
  resume_raw_text: z.string().trim(),
  linkedin_url: z.string().trim(),
  portfolio_url: z.string().trim(),
  source: z.enum(CANDIDATE_SOURCES),
  job_id: z.string().trim().min(1, "Job assignment is required."),
  notes: z.string().trim(),
  screening_notes: z.string().trim().min(20, "Screening notes must be at least 20 characters."),
  meets_experience_requirement: z.enum(["YES", "NO"]),
  work_authorization: z.enum(["YES", "NO"]),
  screening_fit_score: z.enum(["1", "2", "3", "4", "5"]),
  initial_stage: z.enum(["APPLIED", "SCREENING", "TECHNICAL_L1"]),
});

const initialDraft: CandidateDraft = {
  full_name: "",
  email: "",
  phone: "",
  current_role: "",
  current_company: "",
  total_experience_yrs: "",
  skills: "",
  resume_url: "",
  resume_raw_text: "",
  linkedin_url: "",
  portfolio_url: "",
  source: "OTHER",
  job_id: "",
  notes: "",
  screening_notes: "",
  meets_experience_requirement: "YES",
  work_authorization: "YES",
  screening_fit_score: "3",
  initial_stage: "APPLIED",
};

const WIZARD_STEPS = [
  { step: 1, label: "Import Resume", description: "Upload PDF/DOCX" },
  { step: 2, label: "Review Details", description: "Verify parsed data" },
  { step: 3, label: "Screening", description: "Mandatory recruiter checks" },
  { step: 4, label: "Assign Pipeline", description: "Select job and stage" },
] as const;

type WizardStep = (typeof WIZARD_STEPS)[number]["step"];

function fromParsed(parsed: ParsedResumeData, resumeUrl: string, previous: CandidateDraft): CandidateDraft {
  return {
    ...previous,
    full_name: parsed.full_name,
    email: parsed.email,
    phone: parsed.phone,
    current_role: parsed.current_role,
    current_company: parsed.current_company,
    total_experience_yrs: parsed.total_experience_yrs?.toString() ?? "",
    skills: parsed.skills.join(", "),
    resume_url: resumeUrl,
    resume_raw_text: parsed.raw_text,
  };
}

function buildScreeningSummary(values: CandidateDraft): string {
  const sections: string[] = [];

  if (values.notes.trim()) {
    sections.push(values.notes.trim());
  }

  sections.push(
    "[Screening Summary]",
    `- Assessment Notes: ${values.screening_notes.trim()}`,
    `- Fit Score: ${values.screening_fit_score}/5`,
    `- Experience Requirement: ${values.meets_experience_requirement}`,
    `- Work Authorization: ${values.work_authorization}`,
  );

  if (values.portfolio_url.trim()) {
    sections.push(`- Portfolio: ${values.portfolio_url.trim()}`);
  }

  return sections.join("\n");
}

export function NewCandidateWizard({ jobs }: NewCandidateWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CandidateDraft>({
    resolver: zodResolver(CandidateWizardSchema),
    defaultValues: initialDraft,
  });

  const handleUploaded = (resumeUrl: string, parsed: ParsedResumeData | null): void => {
    if (parsed) {
      const previousValues = form.getValues();
      form.reset(fromParsed(parsed, resumeUrl, previousValues));
    } else {
      form.setValue("resume_url", resumeUrl, { shouldValidate: true });
    }

    setStep(2);
  };

  const goToScreening = async (): Promise<void> => {
    const valid = await form.trigger([
      "full_name",
      "email",
      "phone",
      "current_role",
      "current_company",
      "total_experience_yrs",
      "skills",
      "resume_url",
    ]);

    if (valid) {
      setStep(3);
    }
  };

  const goToAssignment = async (): Promise<void> => {
    const valid = await form.trigger([
      "screening_notes",
      "screening_fit_score",
      "meets_experience_requirement",
      "work_authorization",
    ]);

    if (valid) {
      setStep(4);
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone.trim() ? values.phone.trim() : undefined,
        current_role: values.current_role.trim() ? values.current_role.trim() : undefined,
        current_company: values.current_company.trim() ? values.current_company.trim() : undefined,
        total_experience_yrs: values.total_experience_yrs.trim() ? Number(values.total_experience_yrs) : undefined,
        skills: values.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        resume_url: values.resume_url,
        resume_raw_text: values.resume_raw_text,
        linkedin_url: values.linkedin_url.trim() ? values.linkedin_url.trim() : undefined,
        source: values.source,
        job_id: values.job_id,
        notes: buildScreeningSummary(values),
      };

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json()) as CandidateResponse | ErrorResponse;
      if (!response.ok) {
        const message = "error" in responseBody ? responseBody.error : "Candidate creation failed";
        throw new Error(message);
      }

      if (!("candidate" in responseBody)) {
        throw new Error("Unexpected API response");
      }

      if (values.initial_stage !== "APPLIED") {
        const stageResponse = await fetch(`/api/candidates/${responseBody.candidate.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stage: values.initial_stage }),
        });

        if (!stageResponse.ok) {
          const stagePayload = (await stageResponse.json()) as ErrorResponse;
          throw new Error(stagePayload.error ?? "Candidate created, but stage update failed");
        }
      }

      router.push(`/candidates/${responseBody.candidate.id}`);
      router.refresh();
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue instanceof Error ? submitErrorValue.message : "Failed to create candidate");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <div className="xl:sticky xl:top-24 xl:self-start">
        <WizardProgressSidebar steps={WIZARD_STEPS} currentStep={step} />
      </div>

      <div className="space-y-6">
        {step === 1 ? <UploadStep form={form} onUploaded={handleUploaded} /> : null}

        {step === 2 ? <ReviewStep form={form} onBack={() => setStep(1)} onNext={goToScreening} /> : null}

        {step === 3 ? <ScreeningStep form={form} onBack={() => setStep(2)} onNext={goToAssignment} /> : null}

        {step === 4 ? (
          <AssignStep
            form={form}
            jobs={jobs}
            submitting={submitting}
            submitError={submitError}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
          />
        ) : null}
      </div>
    </div>
  );
}
