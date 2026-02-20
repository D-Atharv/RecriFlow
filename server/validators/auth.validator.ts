import type { LoginInput, RegisterInput } from "@/types/auth";
import { LoginSchema, RegisterSchema } from "@/types/schemas";
import { ValidationResult, zodIssuesToMap } from "@/server/validators/shared";

export function validateLoginInput(payload: unknown): ValidationResult<LoginInput> {
  const parsed = LoginSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {
        email: "",
        password: "",
      },
      issues: zodIssuesToMap(parsed.error),
    };
  }

  return {
    data: parsed.data,
    issues: {},
  };
}

export function validateRegisterInput(payload: unknown): ValidationResult<RegisterInput> {
  const parsed = RegisterSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      data: {
        full_name: "",
        company_name: "",
        email: "",
        password: "",
      },
      issues: zodIssuesToMap(parsed.error),
    };
  }

  return {
    data: parsed.data,
    issues: {},
  };
}
