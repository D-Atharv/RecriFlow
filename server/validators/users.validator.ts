import type { UpdateUserInput } from "@/types/domain";
import { UpdateUserSchema } from "@/types/schemas";
import { ValidationResult, zodIssuesToMap } from "@/server/validators/shared";

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

