import type { CreateJobInput, UpdateJobInput } from "@/types/domain";
import { CreateJobSchema, UpdateJobSchema } from "@/types/schemas";
import { ValidationResult, zodIssuesToMap } from "@/server/validators/shared";

export function validateCreateJobInput(payload: unknown): ValidationResult<CreateJobInput> {
  const parsed = CreateJobSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {
        title: "",
        department: "",
        description: "",
        required_skills: [],
        experience_min: 0,
        experience_max: 0,
      },
      issues: zodIssuesToMap(parsed.error),
    };
  }

  return {
    data: parsed.data,
    issues: {},
  };
}

export function validateUpdateJobInput(payload: unknown): ValidationResult<UpdateJobInput> {
  const parsed = UpdateJobSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {},
      issues: zodIssuesToMap(parsed.error),
    };
  }

  return {
    data: parsed.data,
    issues: {},
  };
}
