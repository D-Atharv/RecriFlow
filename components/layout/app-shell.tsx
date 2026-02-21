import type { ReactNode } from "react";

import { GlobalNav } from "@/components/layout/global-nav";
import type { SessionUser } from "@/types/auth";

interface AppShellProps {
  user: SessionUser;
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-background-light text-gray-900">
      <GlobalNav user={user} />
      <main className="mx-auto w-full max-w-[1600px] px-10 pb-6 pt-3">{children}</main>
    </div>
  );
}
