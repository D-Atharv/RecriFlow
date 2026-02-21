"use client";

import { useMemo, useState } from "react";

import { BillingPanel } from "@/components/settings/billing/billing-panel";
import { CompanyProfilePanel } from "@/components/settings/company/company-profile-panel";
import { IntegrationsPanel } from "@/components/settings/integrations/integrations-panel";
import { LogsPanel } from "@/components/settings/logs/logs-panel";
import { SettingsSubnav } from "@/components/settings/settings-subnav";
import type { SettingsTabId, SettingsWorkspaceData } from "@/components/settings/types";
import { UserManagementPanel } from "@/components/settings/users/user-management-panel";

interface SettingsWorkspaceProps {
  data: SettingsWorkspaceData;
  initialTab?: SettingsTabId;
}

function computeInitialSheetsHealth(data: SettingsWorkspaceData): boolean {
  const hasSheetId = data.envChecks.some((check) => check.key === "GOOGLE_SHEET_ID" && check.configured);
  const hasAccount = data.envChecks.some(
    (check) =>
      (check.key === "GOOGLE_SERVICE_ACCOUNT_KEY" || check.key === "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64") && check.configured,
  );

  const recentFailed = data.syncLogs.slice(0, 5).some((log) => log.status === "FAILED");
  return hasSheetId && hasAccount && !recentFailed;
}

export function SettingsWorkspace({ data, initialTab = "users" }: SettingsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);

  const initialSheetsHealthy = useMemo(() => computeInitialSheetsHealth(data), [data]);
  const isAdmin = data.currentUserRole === "ADMIN";
  const canForceSync = data.currentUserRole === "ADMIN" || data.currentUserRole === "RECRUITER";

  return (
    <div className="space-y-4">
      <SettingsSubnav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "users" ? (
        <UserManagementPanel users={data.users} currentUserId={data.currentUserId} canManage={isAdmin} />
      ) : null}

      {activeTab === "company" ? <CompanyProfilePanel /> : null}

      {activeTab === "integrations" ? (
        <IntegrationsPanel
          envChecks={data.envChecks}
          initialSheetsHealthy={initialSheetsHealthy}
          canTestConnection={isAdmin}
          syncLogs={data.syncLogs}
          rejections={data.rejections}
          onOpenLogs={() => setActiveTab("logs")}
        />
      ) : null}

      {activeTab === "logs" ? (
        <LogsPanel syncLogs={data.syncLogs} rejections={data.rejections} canForceSync={canForceSync} />
      ) : null}

      {activeTab === "billing" ? <BillingPanel users={data.users} /> : null}
    </div>
  );
}
