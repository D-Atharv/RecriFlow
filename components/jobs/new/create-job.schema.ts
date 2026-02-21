import { z } from "zod";
import { DEFAULT_INTERVIEW_PLAN_TEMPLATE_ID, getDefaultInterviewPlan } from "@/lib/interview-plan";
import { INTERVIEW_PLAN_STEP_KINDS, JOB_OUTCOME_STAGES, ROUND_TYPES } from "@/types/domain";

export const JOB_DEPARTMENT_OPTIONS = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Operations",
  "HR",
  "Finance",
  "Other",
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = ["FULL_TIME", "PART_TIME", "CONTRACT"] as const;

const InterviewPlanFormStepSchema = z
  .object({
    key: z.string().trim().min(1),
    label: z.string().trim().min(1),
    kind: z.enum(INTERVIEW_PLAN_STEP_KINDS),
    roundType: z.enum(ROUND_TYPES).nullable(),
    outcomeStage: z.enum(JOB_OUTCOME_STAGES).nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.kind === "ROUND") {
      if (!value.roundType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["roundType"],
          message: "Round type is required.",
        });
      }
      if (value.outcomeStage) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outcomeStage"],
          message: "Outcome stage is not allowed for round steps.",
        });
      }
      return;
    }

    if (!value.outcomeStage) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["outcomeStage"],
        message: "Outcome stage is required.",
      });
    }
    if (value.roundType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["roundType"],
        message: "Round type is not allowed for outcome steps.",
      });
    }
  });

export const CreateJobOpeningSchema = z
  .object({
    title: z.string().trim().min(2, "Job title must be at least 2 characters."),
    department: z.string().trim().min(1, "Department is required."),
    location: z.string().trim().max(120, "Location must be 120 characters or less."),
    description: z.string().trim().min(10, "Description must be at least 10 characters."),
    coreResponsibilitiesText: z.string().trim().min(10, "Add at least one core responsibility."),
    requiredSkillsText: z.string().trim().min(1, "Add at least one required skill."),
    experienceMin: z.number().min(0, "Minimum experience must be 0 or more."),
    experienceMax: z.number().min(0, "Maximum experience must be 0 or more."),
    employmentType: z.enum(EMPLOYMENT_TYPE_OPTIONS),
    isInternalVisible: z.boolean(),
    isPublicVisible: z.boolean(),
    requireResumeParsing: z.boolean(),
    sendAutoReplyEmail: z.boolean(),
    hiringTeamIds: z.array(z.string().min(1)).min(1, "Add at least one hiring team member."),
    interviewPlanTemplateId: z.string().trim().min(1),
    interviewPlan: z.array(InterviewPlanFormStepSchema).min(1, "Add at least one pipeline step."),
  })
  .refine((data) => data.experienceMin <= data.experienceMax, {
    path: ["experienceMax"],
    message: "Maximum experience must be greater than or equal to minimum experience.",
  });

export type CreateJobOpeningValues = z.infer<typeof CreateJobOpeningSchema>;

export const createJobOpeningDefaults: CreateJobOpeningValues = {
  title: "",
  department: "Engineering",
  location: "",
  description: "",
  coreResponsibilitiesText: "",
  requiredSkillsText: "",
  experienceMin: 0,
  experienceMax: 0,
  employmentType: "FULL_TIME",
  isInternalVisible: false,
  isPublicVisible: true,
  requireResumeParsing: true,
  sendAutoReplyEmail: false,
  hiringTeamIds: [],
  interviewPlanTemplateId: DEFAULT_INTERVIEW_PLAN_TEMPLATE_ID,
  interviewPlan: getDefaultInterviewPlan(),
};
