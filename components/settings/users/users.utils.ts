import type { UserRole } from "@/types/domain";

export function formatRoleLabel(role: UserRole): string {
  if (role === "HIRING_MANAGER") {
    return "Hiring Manager";
  }

  return role.charAt(0) + role.slice(1).toLowerCase();
}

export function roleTone(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "bg-slate-200 text-slate-900";
    case "RECRUITER":
      return "bg-slate-100 text-slate-700";
    case "HIRING_MANAGER":
      return "bg-gray-100 text-gray-700";
    case "INTERVIEWER":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function statusTone(isActive: boolean): string {
  return isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
}

export function initials(fullName: string): string {
  return fullName
    .split(" ")
    .map((token) => token.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function avatarTone(index: number): string {
  const tones = [
    "bg-slate-100 text-slate-700",
    "bg-slate-200 text-slate-800",
    "bg-gray-100 text-gray-700",
    "bg-emerald-100 text-emerald-700",
    "bg-slate-300 text-slate-900",
  ];

  return tones[index % tones.length];
}

export function roleDistribution(users: Array<{ role: UserRole }>): Record<UserRole, number> {
  return users.reduce<Record<UserRole, number>>(
    (acc, user) => {
      acc[user.role] += 1;
      return acc;
    },
    {
      ADMIN: 0,
      RECRUITER: 0,
      HIRING_MANAGER: 0,
      INTERVIEWER: 0,
    },
  );
}

export function toLastActiveLabel(isoDate: string): string {
  const deltaMs = Date.now() - new Date(isoDate).getTime();
  const deltaMinutes = Math.floor(deltaMs / (1000 * 60));

  if (deltaMinutes <= 1) {
    return "Just now";
  }

  if (deltaMinutes < 60) {
    return `${deltaMinutes} min ago`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours} hour${deltaHours === 1 ? "" : "s"} ago`;
  }

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays} day${deltaDays === 1 ? "" : "s"} ago`;
}
