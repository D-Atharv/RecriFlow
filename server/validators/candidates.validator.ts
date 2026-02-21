import type { CreateCandidateInput } from "@/types/domain";
import { CreateCandidateSchema } from "@/types/schemas";
import { ValidationResult, zodIssuesToMap } from "@/server/validators/shared";

export function validateCreateCandidateInput(payload: unknown): ValidationResult<CreateCandidateInput> {
  const parsed = CreateCandidateSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {
        full_name: "",
        email: "",
        skills: [],
        resume_url: "",
        resume_raw_text: "",
        source: "OTHER",
        job_id: "",
      },
      issues: zodIssuesToMap(parsed.error),
    };
  }

  const data: CreateCandidateInput = {
    ...parsed.data,
    total_experience_yrs: parsed.data.total_experience_yrs ?? undefined,
  };

  return {
    data,
    issues: {},
  };
}
