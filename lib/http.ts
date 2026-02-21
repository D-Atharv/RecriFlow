import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/server/errors";

export function json<T>(data: T, status = 200): Response {
  return Response.json(data, { status });
}

export function handleRouteError(error: unknown): Response {
  if (error instanceof ValidationError) {
    return json(
      {
        error: error.message,
        issues: error.issues,
      },
      422,
    );
  }

  if (error instanceof ConflictError) {
    return json(
      {
        error: error.message,
        ...error.metadata,
      },
      409,
    );
  }

  if (error instanceof UnauthorizedError) {
    return json({ error: error.message }, 401);
  }

  if (error instanceof ForbiddenError) {
    return json({ error: error.message }, 403);
  }

  if (error instanceof NotFoundError) {
    return json({ error: error.message }, 404);
  }

  console.error(error);
  return json({ error: "Internal server error" }, 500);
}
