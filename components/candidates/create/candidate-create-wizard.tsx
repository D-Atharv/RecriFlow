"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { WizardLayout } from "@/components/candidates/create/shared/wizard-layout";
import { WizardProgressSidebar } from "@/components/candidates/create/shared/wizard-progress-sidebar";
import { WizardTip } from "@/components/candidates/create/shared/wizard-tip";
import { StepImport } from "@/components/candidates/create/steps/step-import";
import { StepReview } from "@/components/candidates/create/steps/step-review";
import { StepScreening } from "@/components/candidates/create/steps/step-screening";
import { StepFinalize } from "@/components/candidates/create/steps/step-finalize";
import type { CandidateWizardValues } from "@/components/candidates/create/types";

import { CANDIDATE_SOURCES, type Job, type ParsedResumeData } from "@/types/domain";
import type { CandidateResponse } from "@/types/api";

interface CandidateCreateWizardProps {
    jobs: Job[];
}

const CandidateWizardSchema = z.object({
    full_name: z.string().trim().min(2, "Full name must contain at least 2 characters."),
    email: z.string().trim().email("A valid email address is required."),
    phone: z.string().trim(),
    current_role: z.string().trim(),
    current_company: z.string().trim(),
    total_experience_yrs: z.string().trim(),
    skills: z.array(z.string().trim().min(1)).min(1, "Add at least one skill."),
    resume_url: z.string().trim().min(1, "Resume upload is required."),
    resume_raw_text: z.string().trim(),
    linkedin_url: z.string().trim(),
    portfolio_url: z.string().trim(),
    source: z.enum(CANDIDATE_SOURCES),
    job_id: z.string().trim().min(1, "Please select a job opening."),
    notes: z.string().trim(),
    assessment_notes: z.string().trim().min(20, "Assessment notes must be at least 20 characters."),
    skill_proficiency: z.number().int().min(1).max(5),
    work_authorization: z.boolean(),
    meets_experience: z.boolean(),
    pipeline_stage: z.enum(["APPLIED", "SCREENING", "TECHNICAL_L1"]),
    manager_notes: z.string().trim(),
});

const WIZARD_STEPS = [
    { step: 1, label: "Import Resume", description: "Upload PDF/DOCX" },
    { step: 2, label: "Review Details", description: "Verify parsed data" },
    { step: 3, label: "Screening", description: "Mandatory recruiter checks" },
    { step: 4, label: "Assign Pipeline", description: "Select job and stage" },
] as const;

const STEP_ONE_FIELDS: FieldPath<CandidateWizardValues>[] = ["resume_url"];
const STEP_TWO_FIELDS: FieldPath<CandidateWizardValues>[] = ["full_name", "email", "skills", "total_experience_yrs"];
const STEP_THREE_FIELDS: FieldPath<CandidateWizardValues>[] = ["assessment_notes", "skill_proficiency"];
const FINAL_SUBMIT_FIELDS: FieldPath<CandidateWizardValues>[] = [
    ...STEP_ONE_FIELDS,
    ...STEP_TWO_FIELDS,
    ...STEP_THREE_FIELDS,
    "job_id",
    "pipeline_stage",
];

interface CandidateCreateErrorResponse {
    error?: string;
    issues?: Record<string, string>;
    existing_id?: string;
}

export function CandidateCreateWizard({ jobs }: CandidateCreateWizardProps) {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<CandidateWizardValues>({
        resolver: zodResolver(CandidateWizardSchema),
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            current_role: "",
            current_company: "",
            total_experience_yrs: "",
            skills: [],
            resume_url: "",
            resume_raw_text: "",
            linkedin_url: "",
            portfolio_url: "",
            source: "DIRECT_APPLICATION",
            job_id: "",
            notes: "",
            assessment_notes: "",
            skill_proficiency: 3,
            work_authorization: true,
            meets_experience: true,
            pipeline_stage: "SCREENING",
            manager_notes: "",
        },
    });

    const handleUploaded = (resumeUrl: string, parsed: ParsedResumeData | null) => {
        if (resumeUrl) form.setValue("resume_url", resumeUrl, { shouldValidate: true });
        if (parsed) {
            form.setValue("full_name", parsed.full_name, { shouldValidate: true });
            form.setValue("email", parsed.email, { shouldValidate: true });
            form.setValue("phone", parsed.phone || "");
            form.setValue("current_role", parsed.current_role || "");
            form.setValue("current_company", parsed.current_company || "");
            form.setValue("total_experience_yrs", parsed.total_experience_yrs?.toString() || "");
            form.setValue("skills", parsed.skills, { shouldValidate: true });
            form.setValue("resume_raw_text", parsed.raw_text);
        }
    };

    const handleFinalSubmit = async () => {
        setSubmitError(null);
        const isValid = await form.trigger(FINAL_SUBMIT_FIELDS, { shouldFocus: true });
        if (!isValid) {
            setSubmitError("Please complete all required fields before finishing.");
            return;
        }

        const values = form.getValues();
        setSubmitting(true);

        try {
            const screeningSummary = [
                "[Screening Summary]",
                `- Assessment Notes: ${values.assessment_notes}`,
                `- Skill Proficiency: ${values.skill_proficiency}/5`,
                `- Experience Requirement: ${values.meets_experience ? "YES" : "NO"}`,
                `- Work Authorization: ${values.work_authorization ? "YES" : "NO"}`,
                values.manager_notes ? `- Hiring Manager Notes: ${values.manager_notes}` : "",
            ]
                .filter(Boolean)
                .join("\n");

            const experienceNum = values.total_experience_yrs ? Number(values.total_experience_yrs) : undefined;
            const safeExperience = (experienceNum === null || isNaN(experienceNum as number)) ? undefined : experienceNum;

            const payload = {
                full_name: values.full_name,
                email: values.email,
                total_experience_yrs: safeExperience,
                phone: values.phone.trim() ? values.phone : undefined,
                current_role: values.current_role.trim() ? values.current_role : undefined,
                current_company: values.current_company.trim() ? values.current_company : undefined,
                skills: values.skills,
                resume_url: values.resume_url,
                resume_raw_text: values.resume_raw_text,
                linkedin_url: values.linkedin_url.trim() ? values.linkedin_url : undefined,
                source: values.source,
                job_id: values.job_id,
                notes: [values.notes, screeningSummary].filter(Boolean).join("\n\n"),
                current_stage: values.pipeline_stage,
            };

            const response = await fetch("/api/candidates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = (await response.json()) as CandidateResponse & CandidateCreateErrorResponse;
            if (!response.ok || !data.candidate) {
                if (response.status === 409 && data.existing_id) {
                    setSubmitError("A candidate with this email already exists. Opening the existing profile.");
                    router.push(`/candidates/${data.existing_id}`);
                    router.refresh();
                    return;
                }

                if (data.issues) {
                    for (const [field, message] of Object.entries(data.issues)) {
                        if (field in form.getValues()) {
                            form.setError(field as FieldPath<CandidateWizardValues>, {
                                type: "server",
                                message,
                            });
                        }
                    }
                }

                throw new Error(data.error ?? "Failed to create candidate");
            }

            router.push(`/candidates/${data.candidate.id}`);
            router.refresh();
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create candidate";
            setSubmitError(message);
            console.error("Candidate create failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <WizardLayout
                sidebar={<WizardProgressSidebar steps={WIZARD_STEPS} currentStep={step} />}
                tip={
                    <WizardTip
                        label="Pro Tip"
                        content="You can bulk upload up to 50 resumes at once by dragging a folder directly into the upload zone."
                    />
                }
                content={
                    <>
                        {step === 1 && (
                            <StepImport
                                form={form}
                                jobs={jobs}
                                onUploaded={handleUploaded}
                                onNext={async () => {
                                    setSubmitError(null);
                                    const ok = await form.trigger(STEP_ONE_FIELDS, { shouldFocus: true });
                                    if (ok) {
                                        setStep(2);
                                    }
                                }}
                                onCancel={() => router.back()}
                            />
                        )}
                        {step === 2 && (
                            <StepReview
                                form={form}
                                onNext={async () => {
                                    setSubmitError(null);
                                    const ok = await form.trigger(STEP_TWO_FIELDS, { shouldFocus: true });
                                    if (ok) {
                                        setStep(3);
                                    }
                                }}
                                onBack={() => setStep(1)}
                            />
                        )}
                        {step === 3 && (
                            <StepScreening
                                form={form}
                                onNext={async () => {
                                    setSubmitError(null);
                                    const ok = await form.trigger(STEP_THREE_FIELDS, { shouldFocus: true });
                                    if (ok) {
                                        setStep(4);
                                    }
                                }}
                                onBack={() => setStep(2)}
                            />
                        )}
                        {step === 4 && (
                            <StepFinalize
                                form={form}
                                jobs={jobs}
                                onBack={() => setStep(3)}
                                onSubmit={handleFinalSubmit}
                                submitting={submitting}
                                submitError={submitError}
                            />
                        )}
                    </>
                }
            />
        </div>
    );
}
