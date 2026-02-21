import type { RejectionCategory, SyncStatus, User, UserRole } from "@/types/domain";

export const SETTINGS_TABS = ["users", "company", "integrations", "logs", "billing"] as const;
export type SettingsTabId = (typeof SETTINGS_TABS)[number];

export function isSettingsTabId(value: string): value is SettingsTabId {
  return SETTINGS_TABS.includes(value as SettingsTabId);
}

export interface SettingsEnvCheck {
  key: string;
  configured: boolean;
  note: string;
}

export interface SettingsSyncLogItem {
  id: string;
  candidateId: string;
  candidateName: string;
  status: SyncStatus;
  errorMessage: string | null;
  syncedAt: string;
}

export interface SettingsRejectionItem {
  id: string;
  candidateId: string;
  candidateName: string;
  category: RejectionCategory;
  notes: string;
  createdAt: string;
}

export interface SettingsWorkspaceData {
  currentUserId: string;
  currentUserRole: UserRole;
  users: User[];
  envChecks: SettingsEnvCheck[];
  syncLogs: SettingsSyncLogItem[];
  rejections: SettingsRejectionItem[];
}

export interface CreateUserDraft {
  full_name: string;
  company_name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}
