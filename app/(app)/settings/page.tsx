import { SettingsWorkspace } from "@/components/settings/settings-workspace";
import type { SettingsEnvCheck } from "@/components/settings/types";
import { requireAppRole } from "@/server/auth/guards";
import { settingsService } from "@/server/services/settings.service";
import { usersService } from "@/server/services/users.service";

export const dynamic = "force-dynamic";

const ENV_CHECKS: SettingsEnvCheck[] = [
  { key: "DATABASE_URL", configured: Boolean(process.env.DATABASE_URL), note: "Supabase PostgreSQL connection string" },
  { key: "AUTH_SECRET", configured: Boolean(process.env.AUTH_SECRET), note: "Session signing secret" },
  { key: "PARSER_SERVICE_URL", configured: Boolean(process.env.PARSER_SERVICE_URL), note: "External parser endpoint" },
  { key: "AWS_S3_REGION", configured: Boolean(process.env.AWS_S3_REGION), note: "AWS region for object storage" },
  { key: "AWS_S3_BUCKET_NAME", configured: Boolean(process.env.AWS_S3_BUCKET_NAME), note: "S3 bucket for resume files" },
  { key: "AWS_S3_ACCESS_KEY_ID", configured: Boolean(process.env.AWS_S3_ACCESS_KEY_ID), note: "S3 access key (server only)" },
  {
    key: "AWS_S3_SECRET_ACCESS_KEY",
    configured: Boolean(process.env.AWS_S3_SECRET_ACCESS_KEY),
    note: "S3 secret key (server only)",
  },
  { key: "GOOGLE_SHEET_ID", configured: Boolean(process.env.GOOGLE_SHEET_ID), note: "Stakeholder sheet sync target" },
  {
    key: "GOOGLE_SERVICE_ACCOUNT_KEY",
    configured: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    note: "Raw JSON or plain service account key",
  },
  {
    key: "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64",
    configured: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64),
    note: "Base64 encoded service account JSON (recommended)",
  },
  { key: "RESEND_API_KEY", configured: Boolean(process.env.RESEND_API_KEY), note: "Email notification provider" },
];

export default async function SettingsPage() {
  const currentUser = await requireAppRole(["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"]);
  const [users, syncLogs, rejections] = await Promise.all([
    usersService.listUsers(),
    settingsService.listSyncLogs(),
    settingsService.listRejections(),
  ]);

  return (
    <SettingsWorkspace
      data={{
        currentUserId: currentUser.id,
        currentUserRole: currentUser.role,
        users,
        envChecks: ENV_CHECKS,
        syncLogs,
        rejections,
      }}
    />
  );
}
