import type { CreateUserInput, UpdateUserInput } from "@/types/domain";
import { CreateUserSchema, UpdateUserSchema } from "@/types/schemas";
import { ValidationResult, zodIssuesToMap } from "@/server/validators/shared";

export function validateCreateUserInput(payload: unknown): ValidationResult<CreateUserInput> {
  const parsed = CreateUserSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {
        full_name: "",
        email: "",
        password: "",
        role: "RECRUITER",
      },
      issues: zodIssuesToMap(parsed.error),
    };
  }

  return {
    data: parsed.data,
    issues: {},
  };
}

export function validateUpdateUserInput(payload: unknown): ValidationResult<UpdateUserInput> {
  const parsed = UpdateUserSchema.safeParse(payload);

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
