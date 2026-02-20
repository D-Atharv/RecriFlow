import type { ReactNode } from "react";

import { GlobalNav } from "@/components/layout/global-nav";
import type { SessionUser } from "@/types/auth";

interface AppShellProps {
  user: SessionUser;
  children: ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="h-screen w-full flex flex-col bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden">
      <GlobalNav user={user} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
