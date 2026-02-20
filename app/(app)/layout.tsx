import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireAppUser } from "@/server/auth/guards";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireAppUser();

  return <AppShell user={user}>{children}</AppShell>;
}
