import { UsersManagementClient } from "@/components/settings/users-management-client";
import { PageHeading } from "@/components/ui/page-heading";
import { requireAppRole } from "@/server/auth/guards";
import { usersService } from "@/server/services/users.service";

const checkRows = [
  { key: "DATABASE_URL", configured: Boolean(process.env.DATABASE_URL), note: "Supabase PostgreSQL connection string" },
  { key: "AUTH_SECRET", configured: Boolean(process.env.AUTH_SECRET), note: "Session signing secret" },
  { key: "PARSER_SERVICE_URL", configured: Boolean(process.env.PARSER_SERVICE_URL), note: "External parser endpoint" },
  { key: "AWS_S3_REGION", configured: Boolean(process.env.AWS_S3_REGION), note: "AWS region for object storage" },
  { key: "AWS_S3_BUCKET_NAME", configured: Boolean(process.env.AWS_S3_BUCKET_NAME), note: "S3 bucket for resume files" },
  { key: "AWS_S3_ACCESS_KEY_ID", configured: Boolean(process.env.AWS_S3_ACCESS_KEY_ID), note: "S3 access key (server only)" },
  { key: "AWS_S3_SECRET_ACCESS_KEY", configured: Boolean(process.env.AWS_S3_SECRET_ACCESS_KEY), note: "S3 secret key (server only)" },
  { key: "GOOGLE_SHEET_ID", configured: Boolean(process.env.GOOGLE_SHEET_ID), note: "Stakeholder sheet sync target" },
  { key: "RESEND_API_KEY", configured: Boolean(process.env.RESEND_API_KEY), note: "Email notification provider" },
];

export default async function SettingsPage() {
  const currentUser = await requireAppRole(["ADMIN"]);
  const users = await usersService.listUsers();

  return (
    <div className="space-y-6">
      <PageHeading title="Settings" description="Environment readiness and integration health." />

      <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-5">
        <h3 className="text-lg font-semibold">Environment Configuration</h3>
        <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
          This table shows whether required server configuration is present.
        </p>

        <div className="mt-4 overflow-hidden rounded-lg border border-[color:var(--color-border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color:var(--color-panel)] text-xs uppercase tracking-wide text-[color:var(--color-ink-muted)]">
              <tr>
                <th className="px-4 py-3">Variable</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {checkRows.map((row) => (
                <tr key={row.key} className="border-t border-[color:var(--color-border)]">
                  <td className="px-4 py-3 font-mono text-xs">{row.key}</td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        "rounded-full px-2 py-1 text-xs font-semibold",
                        row.configured ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
                      ].join(" ")}
                    >
                      {row.configured ? "Configured" : "Missing"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--color-ink-soft)]">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <UsersManagementClient users={users} currentUserId={currentUser.id} />
    </div>
  );
}
