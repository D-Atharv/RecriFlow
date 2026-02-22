import { Suspense } from "react";

import { requireAppRole } from "@/server/auth/guards";

import { SettingsContent } from "./_components/settings-content";
import { SettingsSkeleton } from "./_components/settings-skeleton";

export default async function SettingsPage() {
  const currentUser = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"]);

  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent currentUserId={currentUser.id} currentUserRole={currentUser.role} />
    </Suspense>
  );
}
