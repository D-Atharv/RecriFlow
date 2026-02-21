"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { RejectionLogsSection } from "@/components/settings/logs/rejection-logs-section";
import { SyncLogsSection } from "@/components/settings/logs/sync-logs-section";
import type { SettingsRejectionItem, SettingsSyncLogItem } from "@/components/settings/types";
type LogsView = "sync" | "rejections";

interface LogsPanelProps {
  syncLogs: SettingsSyncLogItem[];
  rejections: SettingsRejectionItem[];
  canForceSync: boolean;
}

export function LogsPanel({ syncLogs, rejections, canForceSync }: LogsPanelProps) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<LogsView>("sync");
  const [syncingCandidateId, setSyncingCandidateId] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const failed = syncLogs.filter((item) => item.status === "FAILED").length;
    const pending = syncLogs.filter((item) => item.status === "PENDING").length;
    const success = syncLogs.filter((item) => item.status === "SUCCESS").length;

    return {
      failed,
      pending,
      success,
    };
  }, [syncLogs]);

  const onForceSync = async (candidateId: string, candidateName: string): Promise<void> => {
    setSyncingCandidateId(candidateId);
    setSyncMessage(null);

    try {
      const response = await fetch(`/api/sheets/sync/${candidateId}`, {
        method: "POST",
      });

      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(body.error ?? "Manual sync failed");
      }

      setSyncMessage(`Manual sync completed for ${candidateName}.`);
      router.refresh();
    } catch (error) {
      setSyncMessage(error instanceof Error ? error.message : "Manual sync failed");
    } finally {
      setSyncingCandidateId(null);
    }
  };

  return (
    <div className="space-y-4">
      <header className="mb-1">
        <h2 className="text-[15px] font-bold tracking-tight text-slate-900 leading-none">Operational Logs</h2>
        <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          Audit sheet sync activity, rejection records and reconciliation context.
        </p>
      </header>

      <section className="grid gap-3.5 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200/60 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-slate-300/60">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Sync Success</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-[28px] font-bold tracking-tight text-emerald-600 leading-none">{metrics.success}</p>
            <span className="text-[10px] font-bold text-emerald-600/50 uppercase tracking-wider">Entries</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-slate-500 leading-none">Synced without intervention.</p>
        </article>
        <article className="rounded-xl border border-slate-200/60 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-slate-300/60">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Failed Syncs</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-[28px] font-bold tracking-tight text-rose-600 leading-none">{metrics.failed}</p>
            <span className="text-[10px] font-bold text-rose-600/50 uppercase tracking-wider">Errors</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-slate-500 leading-none">Requires manual reconciliation.</p>
        </article>
        <article className="rounded-xl border border-slate-200/60 bg-white px-4 py-3.5 shadow-sm transition-all hover:border-slate-300/60">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Pending Queue</p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-[28px] font-bold tracking-tight text-amber-600 leading-none">{metrics.pending}</p>
            <span className="text-[10px] font-bold text-amber-600/50 uppercase tracking-wider">Queue</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-slate-500 leading-none">Awaiting config or retry.</p>
        </article>
      </section>

      <section className="inline-flex h-9 items-center rounded border border-slate-200 bg-white p-0.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveView("sync")}
          className={[
            "inline-flex h-7.5 items-center rounded px-3 text-[10px] font-bold uppercase tracking-widest transition-all",
            activeView === "sync" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600",
          ].join(" ")}
        >
          Sync Logs
          <span className={`ml-2 rounded px-1 text-[9px] font-bold ${activeView === "sync" ? "bg-slate-700 text-white/90" : "bg-slate-100 text-slate-400"}`}>{syncLogs.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveView("rejections")}
          className={[
            "inline-flex h-7.5 items-center rounded px-3 text-[10px] font-bold uppercase tracking-widest transition-all",
            activeView === "rejections" ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-600",
          ].join(" ")}
        >
          Rejections
          <span className={`ml-2 rounded px-1 text-[9px] font-bold ${activeView === "rejections" ? "bg-slate-700 text-white/90" : "bg-slate-100 text-slate-400"}`}>{rejections.length}</span>
        </button>
      </section>

      {activeView === "sync" ? (
        <SyncLogsSection
          syncLogs={syncLogs}
          canForceSync={canForceSync}
          syncingCandidateId={syncingCandidateId}
          syncMessage={syncMessage}
          onForceSync={(candidateId, candidateName) => {
            void onForceSync(candidateId, candidateName);
          }}
        />
      ) : (
        <RejectionLogsSection rejections={rejections} />
      )}
    </div>
  );
}
