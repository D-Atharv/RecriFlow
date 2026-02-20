import type { UserRole } from "@/types/domain";

const DEFAULT_ROUTE_BY_ROLE: Record<UserRole, string> = {
  ADMIN: "/dashboard",
  RECRUITER: "/dashboard",
  HIRING_MANAGER: "/dashboard",
  INTERVIEWER: "/jobs",
};

export function getDefaultAppRoute(role: UserRole): string {
  return DEFAULT_ROUTE_BY_ROLE[role];
}
