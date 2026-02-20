import type { CreateRoundInput, SubmitFeedbackInput } from "@/types/domain";
import { CreateRoundSchema, SubmitFeedbackSchema } from "@/types/schemas";
import { ValidationResult, zodIssuesToMap } from "@/server/validators/shared";

export function validateCreateRoundInput(payload: unknown): ValidationResult<CreateRoundInput> {
  const parsed = CreateRoundSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {
        round_type: "SCREENING",
        interviewer_id: "",
      },
      issues: zodIssuesToMap(parsed.error),
    };
  }

  return {
    data: {
      ...parsed.data,
      scheduled_at: parsed.data.scheduled_at ?? null,
    },
    issues: {},
  };
}

export function validateSubmitFeedbackInput(payload: unknown): ValidationResult<SubmitFeedbackInput> {
  const parsed = SubmitFeedbackSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {
        technical_rating: 0,
        communication_rating: 0,
        problem_solving_rating: 0,
        culture_fit_rating: 0,
        overall_rating: 0,
        strengths_text: "",
        improvement_text: "",
        recommendation: "YES",
      },
      issues: zodIssuesToMap(parsed.error),
    };
  }

  return {
    data: parsed.data,
    issues: {},
  };
}
