"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AssignStep } from "@/components/candidates/wizard/assign-step";
import { ReviewStep, type CandidateDraft } from "@/components/candidates/wizard/review-step";
import { UploadStep } from "@/components/candidates/wizard/upload-step";
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
  resume_url: z.string().trim().min(1, "Resume URL is required."),
  resume_raw_text: z.string().trim(),
  linkedin_url: z.string().trim(),
  source: z.enum(CANDIDATE_SOURCES),
  job_id: z.string().trim().min(1, "Job assignment is required."),
  notes: z.string().trim(),
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
  source: "OTHER",
  job_id: "",
  notes: "",
};

function fromParsed(parsed: ParsedResumeData, resumeUrl: string): CandidateDraft {
  return {
    ...initialDraft,
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

export function NewCandidateWizard({ jobs }: NewCandidateWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CandidateDraft>({
    resolver: zodResolver(CandidateWizardSchema),
    defaultValues: initialDraft,
  });

  const handleUploaded = (resumeUrl: string, parsed: ParsedResumeData | null): void => {
    if (parsed) {
      form.reset(fromParsed(parsed, resumeUrl));
    } else {
      form.setValue("resume_url", resumeUrl, { shouldValidate: true });
    }

    setStep(2);
  };

  const goToAssignment = async (): Promise<void> => {
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

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...values,
        total_experience_yrs: values.total_experience_yrs.trim() ? Number(values.total_experience_yrs) : undefined,
        skills: values.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
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

      router.push(`/candidates/${responseBody.candidate.id}`);
      router.refresh();
    } catch (submitErrorValue) {
      setSubmitError(submitErrorValue instanceof Error ? submitErrorValue.message : "Failed to create candidate");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
        <div className="flex gap-2 text-sm">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className={[
                "rounded-full px-3 py-1 font-medium",
                item === step
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "bg-white text-[color:var(--color-ink-soft)]",
              ].join(" ")}
            >
              Step {item}
            </div>
          ))}
        </div>
      </div>

      {step === 1 ? <UploadStep onUploaded={handleUploaded} /> : null}

      {step === 2 ? <ReviewStep form={form} onNext={goToAssignment} /> : null}

      {step === 3 ? (
        <AssignStep
          form={form}
          jobs={jobs}
          submitting={submitting}
          submitError={submitError}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </div>
  );
}
