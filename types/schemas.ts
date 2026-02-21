import { z } from "zod";

import {
  CANDIDATE_SOURCES,
  INTERVIEW_PLAN_STEP_KINDS,
  JOB_STATUSES,
  JOB_OUTCOME_STAGES,
  PIPELINE_STAGES,
  RECOMMENDATIONS,
  REJECTION_CATEGORIES,
  ROUND_TYPES,
  USER_ROLES,
} from "@/types/domain";

const EmailSchema = z.string().trim().email("A valid email is required.");

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const RegisterSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters."),
  company_name: z.string().trim().min(2, "Company name must be at least 2 characters."),
  email: EmailSchema,
  password: z.string().min(10, "Password must be at least 10 characters."),
});

export const CreateUserSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters."),
  company_name: z.string().trim().optional(),
  email: EmailSchema,
  password: z.string().min(10, "Password must be at least 10 characters."),
  role: z.enum(USER_ROLES),
  is_active: z.boolean().optional().default(true),
});

export const CreateCandidateSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: EmailSchema,
  phone: z.string().trim().optional(),
  current_role: z.string().trim().optional(),
  current_company: z.string().trim().optional(),
  total_experience_yrs: z.number().min(0).max(50).nullable().optional(),
  skills: z.array(z.string().trim().min(1)).min(1, "Add at least one skill."),
  resume_url: z.string().trim().min(1, "Resume URL is required."),
  resume_raw_text: z.string().trim().default(""),
  linkedin_url: z.string().trim().optional(),
  source: z.enum(CANDIDATE_SOURCES),
  job_id: z.string().trim().min(1, "Job assignment is required."),
  notes: z.string().trim().optional(),
  current_stage: z.enum(PIPELINE_STAGES).optional(),
});

export const CreateJobSchema = z
  .object({
    interview_plan: z
      .array(
        z
          .object({
            key: z.string().trim().min(1, "Step key is required."),
            label: z.string().trim().min(1, "Step label is required."),
            kind: z.enum(INTERVIEW_PLAN_STEP_KINDS),
            roundType: z.enum(ROUND_TYPES).nullable(),
            outcomeStage: z.enum(JOB_OUTCOME_STAGES).nullable(),
          })
          .superRefine((value, ctx) => {
            if (value.kind === "ROUND") {
              if (!value.roundType) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Round type is required for ROUND steps.",
                  path: ["roundType"],
                });
              }
              if (value.outcomeStage) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Outcome stage must be empty for ROUND steps.",
                  path: ["outcomeStage"],
                });
              }
              return;
            }

            if (!value.outcomeStage) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Outcome stage is required for OUTCOME steps.",
                path: ["outcomeStage"],
              });
            }
            if (value.roundType) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Round type must be empty for OUTCOME steps.",
                path: ["roundType"],
              });
            }
          }),
      )
      .min(1, "Add at least one interview step."),
    title: z.string().trim().min(2, "Title must be at least 2 characters."),
    department: z.string().trim().min(1, "Department is required."),
    description: z.string().trim().min(10, "Description must be at least 10 characters."),
    core_responsibilities: z.array(z.string().trim().min(1)).min(1, "Add at least one core responsibility."),
    required_skills: z.array(z.string().trim().min(1)).min(1, "Add at least one required skill."),
    experience_min: z.number().min(0),
    experience_max: z.number().min(0),
    status: z.enum(JOB_STATUSES).optional().default("OPEN"),
  })
  .refine((data) => data.experience_min <= data.experience_max, {
    path: ["experience"],
    message: "Minimum experience cannot exceed maximum experience.",
  });

export const UpdateJobSchema = z
  .object({
    interview_plan: z
      .array(
        z
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
                  message: "Round type is required for ROUND steps.",
                  path: ["roundType"],
                });
              }
              if (value.outcomeStage) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Outcome stage must be empty for ROUND steps.",
                  path: ["outcomeStage"],
                });
              }
              return;
            }

            if (!value.outcomeStage) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Outcome stage is required for OUTCOME steps.",
                path: ["outcomeStage"],
              });
            }
            if (value.roundType) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Round type must be empty for OUTCOME steps.",
                path: ["roundType"],
              });
            }
          }),
      )
      .min(1)
      .optional(),
    title: z.string().trim().min(2).optional(),
    department: z.string().trim().min(1).optional(),
    description: z.string().trim().min(10).optional(),
    core_responsibilities: z.array(z.string().trim().min(1)).min(1).optional(),
    required_skills: z.array(z.string().trim().min(1)).min(1).optional(),
    experience_min: z.number().min(0).optional(),
    experience_max: z.number().min(0).optional(),
    status: z.enum(JOB_STATUSES).optional(),
  })
  .refine(
    (data) => {
      if (data.experience_min === undefined || data.experience_max === undefined) {
        return true;
      }

      return data.experience_min <= data.experience_max;
    },
    {
      path: ["experience"],
      message: "Minimum experience cannot exceed maximum experience.",
    },
  );

export const CreateRoundSchema = z.object({
  round_number: z.number().int().positive().optional(),
  round_type: z.enum(ROUND_TYPES),
  interviewer_id: z.string().trim().min(1, "Interviewer is required."),
  scheduled_at: z
    .string()
    .trim()
    .datetime("Invalid scheduled date.")
    .nullable()
    .optional(),
});

export const SubmitFeedbackSchema = z
  .object({
    technical_rating: z.number().int().min(1).max(5),
    communication_rating: z.number().int().min(1).max(5),
    problem_solving_rating: z.number().int().min(1).max(5),
    culture_fit_rating: z.number().int().min(1).max(5),
    overall_rating: z.number().int().min(1).max(5),
    strengths_text: z.string().trim().min(10, "Please provide at least 10 characters for strengths."),
    improvement_text: z.string().trim().min(10, "Please provide at least 10 characters for improvements."),
    recommendation: z.enum(RECOMMENDATIONS),
    rejection: z
      .object({
        category: z.enum(REJECTION_CATEGORIES),
        notes: z.string().trim().min(20, "Rejection notes must be at least 20 characters."),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (["NO", "STRONG_NO"].includes(data.recommendation)) {
        return Boolean(data.rejection);
      }

      return true;
    },
    {
      path: ["rejection"],
      message: "Rejection details are required for NO/STRONG_NO recommendations.",
    },
  );

export const RejectCandidateSchema = z.object({
  category: z.enum(REJECTION_CATEGORIES),
  notes: z.string().trim().min(20, "Rejection notes must be at least 20 characters."),
});

export const UpdateUserSchema = z
  .object({
    role: z.enum(USER_ROLES).optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => data.role !== undefined || data.is_active !== undefined, {
    message: "At least one field must be provided.",
    path: ["request"],
  });

export type LoginSchemaInput = z.infer<typeof LoginSchema>;
export type RegisterSchemaInput = z.infer<typeof RegisterSchema>;
export type CreateUserSchemaInput = z.infer<typeof CreateUserSchema>;
export type CreateCandidateSchemaInput = z.infer<typeof CreateCandidateSchema>;
export type CreateJobSchemaInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobSchemaInput = z.infer<typeof UpdateJobSchema>;
export type CreateRoundSchemaInput = z.infer<typeof CreateRoundSchema>;
export type SubmitFeedbackSchemaInput = z.infer<typeof SubmitFeedbackSchema>;
export type RejectCandidateSchemaInput = z.infer<typeof RejectCandidateSchema>;
export type UpdateUserSchemaInput = z.infer<typeof UpdateUserSchema>;
