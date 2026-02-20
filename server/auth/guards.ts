import "server-only";

import { redirect } from "next/navigation";
import { getDefaultAppRoute } from "@/lib/app-route";
import { ForbiddenError, UnauthorizedError } from "@/server/errors";
import { getSessionUser } from "@/server/auth/session";
import type { SessionUser } from "@/types/auth";
import type { UserRole } from "@/types/domain";

export async function requireAppUser(redirectTo = "/login"): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireAppRole(roles: UserRole[]): Promise<SessionUser> {
  const user = await requireAppUser();

  if (!roles.includes(user.role)) {
    redirect(getDefaultAppRoute(user.role));
  }

  return user;
}

export async function requireApiUser(roles?: UserRole[]): Promise<SessionUser> {
  const user = await getSessionUser();

  if (!user) {
    throw new UnauthorizedError("Authentication required");
  }

  if (roles && !roles.includes(user.role)) {
    throw new ForbiddenError("You do not have access to this action");
  }

  return user;
}
