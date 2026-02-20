import { nowIso } from "@/lib/dates";
import { LogoutButton } from "@/components/auth/logout-button";
import type { SessionUser } from "@/types/auth";

interface TopBarProps {
  user: SessionUser;
}

export function TopBar({ user }: TopBarProps) {
  const timestamp = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(nowIso()));

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-border)] px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-[color:var(--color-ink-muted)]">TalentLens</p>
        <h1 className="text-xl font-semibold text-[color:var(--color-ink)]">Recruitment Pipeline</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right text-xs text-[color:var(--color-ink-soft)]">
          <p className="font-medium text-[color:var(--color-ink)]">{user.fullName}</p>
          <p>{user.role}</p>
        </div>
        <p className="rounded-full bg-[color:var(--color-panel)] px-3 py-1 text-xs font-medium text-[color:var(--color-ink-soft)]">
          {timestamp}
        </p>
        <LogoutButton />
      </div>
    </header>
  );
}
