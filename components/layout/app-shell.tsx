import type { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { TopBar } from "@/components/layout/top-bar";
import type { SessionUser } from "@/types/auth";

interface AppShellProps {
  user: SessionUser;
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-ink)]">
      <div className="mx-auto grid min-h-screen w-full max-w-[1500px] grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-6">
          <div className="mb-8 space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">TalentLens</p>
            <p className="text-lg font-semibold">Operations Console</p>
          </div>
          <SidebarNav role={user.role} />
        </aside>

        <main className="bg-[color:var(--color-surface)]">
          <TopBar user={user} />
          <section className="px-6 py-6">{children}</section>
        </main>
      </div>
    </div>
  );
}
