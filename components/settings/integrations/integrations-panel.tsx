"use client";

import {
  Database,
  FileSpreadsheet,
  LayoutGrid,
  List,
  Mail,
  PlugZap,
  RefreshCw,
  ServerCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { syncStatusTone, toDateTime, toReadableCategory } from "@/components/settings/logs/log-utils";
import type { SettingsEnvCheck, SettingsRejectionItem, SettingsSyncLogItem } from "@/components/settings/types";

interface IntegrationsPanelProps {
  envChecks: SettingsEnvCheck[];
  initialSheetsHealthy: boolean;
  canTestConnection: boolean;
  syncLogs: SettingsSyncLogItem[];
  rejections: SettingsRejectionItem[];
  onOpenLogs?: () => void;
}

type IntegrationsView = "cards" | "rows";
type IntegrationActivityView = "sync" | "rejections";

interface IntegrationRecord {
  id: string;
  title: string;
  category: string;
  healthy: boolean;
  note: string;
  icon: LucideIcon;
  details: Array<{ label: string; value: string }>;
}

function getEnvConfigured(envChecks: SettingsEnvCheck[], keys: string[]): boolean {
  return envChecks.some((item) => keys.includes(item.key) && item.configured);
}

function toConfiguredLabel(value: boolean): string {
  return value ? "Configured" : "Missing";
}

export function IntegrationsPanel({
  envChecks,
  initialSheetsHealthy,
  canTestConnection,
  syncLogs,
  rejections,
  onOpenLogs,
}: IntegrationsPanelProps) {
  const [testing, setTesting] = useState(false);
  const [viewMode, setViewMode] = useState<IntegrationsView>("cards");
  const [activityView, setActivityView] = useState<IntegrationActivityView>("sync");
  const [sheetsHealthy, setSheetsHealthy] = useState(initialSheetsHealthy);
  const [message, setMessage] = useState<string>(
    initialSheetsHealthy ? "Google Sheets sync looks healthy." : "Google Sheets sync needs configuration.",
  );

  const integrations = useMemo<IntegrationRecord[]>(() => {
    const hasDb = getEnvConfigured(envChecks, ["DATABASE_URL"]);
    const hasSheetId = getEnvConfigured(envChecks, ["GOOGLE_SHEET_ID"]);
    const hasAccount = getEnvConfigured(envChecks, ["GOOGLE_SERVICE_ACCOUNT_KEY", "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64"]);
    const hasParser = getEnvConfigured(envChecks, ["PARSER_SERVICE_URL"]);
    const hasEmail = getEnvConfigured(envChecks, ["RESEND_API_KEY"]);
    const hasS3Bucket = getEnvConfigured(envChecks, ["AWS_S3_BUCKET_NAME"]);
    const hasS3Region = getEnvConfigured(envChecks, ["AWS_S3_REGION"]);
    const latestSync = syncLogs[0]?.syncedAt;

    return [
      {
        id: "sheets",
        title: "Google Sheets",
        category: "Data Sync",
        healthy: sheetsHealthy && hasSheetId && hasAccount,
        note: "Stakeholder reporting and pipeline mirror",
        icon: FileSpreadsheet,
        details: [
          { label: "Spreadsheet ID", value: toConfiguredLabel(hasSheetId) },
          { label: "Service Account", value: toConfiguredLabel(hasAccount) },
          { label: "Last Synced", value: latestSync ? toDateTime(latestSync) : "No syncs yet" },
        ],
      },
      {
        id: "database",
        title: "PostgreSQL",
        category: "Primary Storage",
        healthy: hasDb,
        note: "Primary application datastore",
        icon: Database,
        details: [{ label: "Connection", value: toConfiguredLabel(hasDb) }],
      },
      {
        id: "s3",
        title: "AWS S3",
        category: "File Storage",
        healthy: hasS3Bucket && hasS3Region,
        note: "Resume storage and secure file retrieval",
        icon: ServerCog,
        details: [
          { label: "Bucket", value: toConfiguredLabel(hasS3Bucket) },
          { label: "Region", value: toConfiguredLabel(hasS3Region) },
        ],
      },
      {
        id: "parser",
        title: "Parser Service",
        category: "Resume Parsing",
        healthy: hasParser,
        note: "External parsing endpoint connectivity",
        icon: PlugZap,
        details: [{ label: "Endpoint", value: toConfiguredLabel(hasParser) }],
      },
      {
        id: "email",
        title: "Email Delivery",
        category: "Notifications",
        healthy: hasEmail,
        note: "Assignment and feedback notifications",
        icon: Mail,
        details: [{ label: "Provider Key", value: toConfiguredLabel(hasEmail) }],
      },
    ];
  }, [envChecks, sheetsHealthy, syncLogs]);

  const activityRows = useMemo(() => {
    if (activityView === "sync") {
      return syncLogs.slice(0, 8).map((log) => ({
        id: log.id,
        primary: log.candidateName,
        secondary: log.candidateId,
        status: (
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${syncStatusTone[log.status]}`}>
            {log.status}
          </span>
        ),
        time: toDateTime(log.syncedAt),
        note: log.errorMessage ? log.errorMessage : "No errors",
      }));
    }

    return rejections.slice(0, 8).map((item) => ({
      id: item.id,
      primary: item.candidateName,
      secondary: item.candidateId,
      status: (
        <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
          {toReadableCategory(item.category)}
        </span>
      ),
      time: toDateTime(item.createdAt),
      note: item.notes,
    }));
  }, [activityView, rejections, syncLogs]);

  const runSheetsTest = async (): Promise<void> => {
    setTesting(true);
    setMessage("Testing Google Sheets connectivity...");

    try {
      const response = await fetch("/api/settings/integrations/test", {
        method: "POST",
      });

      const body = (await response.json()) as { success?: boolean; healthy?: boolean; message?: string; error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Connection test failed");
      }

      const healthy = Boolean(body.healthy);
      setSheetsHealthy(healthy);
      setMessage(body.message ?? (healthy ? "Google Sheets connection is healthy." : "Google Sheets connection failed."));
    } catch (error) {
      setSheetsHealthy(false);
      setMessage(error instanceof Error ? error.message : "Connection test failed");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-1">
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-slate-900 leading-none">API & Integrations</h2>
          <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Monitor connector health and dependencies.</p>
        </div>
        <div className="inline-flex h-8.5 items-center rounded border border-slate-200 bg-white p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={[
              "inline-flex h-7 items-center gap-1 rounded px-2.5 text-[10px] font-bold uppercase tracking-widest transition-all",
              viewMode === "cards" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600",
            ].join(" ")}
          >
            <LayoutGrid className="h-3 w-3" />
            Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode("rows")}
            className={[
              "inline-flex h-7 items-center gap-1 rounded px-2.5 text-[10px] font-bold uppercase tracking-widest transition-all",
              viewMode === "rows" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600",
            ].join(" ")}
          >
            <List className="h-3 w-3" />
            Rows
          </button>
        </div>
      </header>

      {viewMode === "cards" ? (
        <section className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => {
            const Icon = integration.icon;

            return (
              <article key={integration.id} className="rounded-xl border border-slate-200/60 bg-white p-3.5 shadow-sm transition-all hover:border-slate-300/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-slate-50 text-slate-400 border border-slate-100 shadow-sm">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <h3 className="text-[14px] font-bold tracking-tight text-slate-900 leading-none">{integration.title}</h3>
                      <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{integration.category}</p>
                    </div>
                  </div>
                  <span
                    className={[
                      "inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest",
                      integration.healthy ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" : "bg-rose-50 text-rose-700 border border-rose-100/50",
                    ].join(" ")}
                  >
                    {integration.healthy ? "Connected" : "Action Required"}
                  </span>
                </div>
                <p className="mt-3 text-[12px] font-semibold text-slate-500 leading-relaxed">{integration.note}</p>
                <div className="mt-3.5 space-y-1.5 rounded border border-slate-100 bg-slate-50/40 px-2 py-2">
                  {integration.details.map((detail) => (
                    <div key={detail.label} className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="font-bold uppercase tracking-widest text-slate-400">{detail.label}</span>
                      <span className="font-bold text-slate-600">{detail.value}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="border-b border-slate-100 bg-slate-50/30">
                <tr className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-3.5 py-1.5 leading-none">Integration</th>
                  <th className="px-3 py-1.5 leading-none">Category</th>
                  <th className="px-3 py-1.5 leading-none">Status</th>
                  <th className="px-3 py-1.5 leading-none">Key Checks</th>
                  <th className="px-3 py-1.5 text-right leading-none">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/50">
                {integrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <tr key={integration.id} className="transition-all hover:bg-slate-50/30">
                      <td className="px-3.5 py-1.5">
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-slate-50 text-slate-400 border border-slate-100">
                            <Icon className="h-3 w-3" />
                          </span>
                          <div>
                            <p className="text-[12px] font-bold text-slate-800 leading-none">{integration.title}</p>
                            <p className="mt-0.5 text-[10px] font-semibold text-slate-500 leading-none truncate max-w-[200px]" title={integration.note}>{integration.note}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{integration.category}</span>
                      </td>
                      <td className="px-3 py-1.5">
                        <span
                          className={[
                            "inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest",
                            integration.healthy ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" : "bg-rose-50 text-rose-700 border border-rose-100/50",
                          ].join(" ")}
                        >
                          {integration.healthy ? "Active" : "Issue"}
                        </span>
                      </td>
                      <td className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {integration.details.map((detail) => `${detail.label}: ${detail.value}`).join(" \u00B7 ")}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {integration.id === "sheets" ? (
                          <button
                            type="button"
                            onClick={() => void runSheetsTest()}
                            disabled={testing || !canTestConnection}
                            className="inline-flex h-6 items-center gap-1 rounded bg-slate-900 border border-slate-900 px-2 text-[9px] font-bold text-white hover:bg-slate-800 transition-all uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className={`h-2.5 w-2.5 ${testing ? "animate-spin" : ""}`} />
                            {testing ? "Syncing" : "Test"}
                          </button>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Fixed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[14px] font-bold text-slate-900 leading-none">Google Sheets Connection</h3>
            <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Run a live check against the configured spreadsheet.</p>
          </div>
          {canTestConnection ? (
            <button
              type="button"
              onClick={() => void runSheetsTest()}
              disabled={testing}
              className="inline-flex h-9 items-center gap-2 rounded bg-slate-900 px-4 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              <RefreshCw className={`h-3 w-3 ${testing ? "animate-spin" : ""}`} />
              {testing ? "Testing..." : "Test Connection"}
            </button>
          ) : (
            <span className="inline-flex h-9 items-center rounded border border-slate-200 bg-slate-50 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Admin Only
            </span>
          )}
        </div>
        <p className="mt-4 text-[11px] font-semibold text-slate-600 bg-slate-50/50 p-2 rounded border border-slate-100/50">{message}</p>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <header className="border-b border-slate-100 bg-slate-50/50 px-4 py-2.5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-slate-900 leading-none">Integration Activity</h3>
              <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Recent sync and rejection activity context.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded border border-slate-200 bg-slate-50 p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setActivityView("sync")}
                  className={[
                    "inline-flex h-6 items-center rounded px-2 text-[9px] font-bold uppercase tracking-widest transition-all",
                    activityView === "sync" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600",
                  ].join(" ")}
                >
                  Sync
                </button>
                <button
                  type="button"
                  onClick={() => setActivityView("rejections")}
                  className={[
                    "inline-flex h-6 items-center rounded px-2 text-[9px] font-bold uppercase tracking-widest transition-all",
                    activityView === "rejections" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600",
                  ].join(" ")}
                >
                  Rejects
                </button>
              </div>
              {onOpenLogs ? (
                <button
                  type="button"
                  onClick={onOpenLogs}
                  className="inline-flex h-7 items-center rounded border border-slate-200 bg-white px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
                >
                  Full Logs
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <div className="max-h-[320px] overflow-y-auto">
          {activityRows.length > 0 ? (
            <ul className="divide-y divide-slate-50/80">
              {activityRows.map((row) => (
                <li key={row.id} className="px-4 py-2 transition-all hover:bg-slate-50/30">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-bold text-slate-800 leading-tight">{row.primary}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{row.secondary}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="scale-90 origin-right">{row.status}</div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{row.time}</span>
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] font-medium text-slate-500 leading-relaxed italic">{row.note}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No activity logs recorded.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
        <h3 className="text-[14px] font-bold text-slate-900 leading-none">Environment Configuration</h3>
        <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Server-side values required for stability.</p>

        <div className="mt-4 overflow-hidden rounded border border-slate-100 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <th className="px-3 py-1.5 border-b border-slate-100">Variable</th>
                <th className="px-3 py-1.5 border-b border-slate-100">Status</th>
                <th className="px-3 py-1.5 border-b border-slate-100">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {envChecks.map((check) => (
                <tr key={check.key} className="text-[11px] transition-all hover:bg-slate-50/30">
                  <td className="px-3 py-1.5 font-mono text-[9px] font-bold text-slate-700">{check.key}</td>
                  <td className="px-3 py-1.5">
                    <span
                      className={[
                        "inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest shadow-sm",
                        check.configured ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50" : "bg-amber-50 text-amber-700 border border-amber-100/50",
                      ].join(" ")}
                    >
                      {check.configured ? "Configured" : "Missing"}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 font-semibold text-slate-500">{check.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
