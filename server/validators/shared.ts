import type { ZodError } from "zod";

export interface ValidationResult<T> {
  data: T;
  issues: Record<string, string>;
}

export function zodIssuesToMap(error: ZodError): Record<string, string> {
  const issues: Record<string, string> = {};

  for (const issue of error.issues) {
    const path = issue.path.length ? issue.path.join(".") : "request";

    if (!issues[path]) {
      issues[path] = issue.message;
    }
  }

  return issues;
}
