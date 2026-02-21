"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { syncStatusTone, toDateTime } from "@/components/settings/logs/log-utils";
import type { SettingsSyncLogItem } from "@/components/settings/types";

interface SyncLogsSectionProps {
  syncLogs: SettingsSyncLogItem[];
  canForceSync: boolean;
  syncingCandidateId: string | null;
  syncMessage: string | null;
  onForceSync: (candidateId: string, candidateName: string) => void;
}

export function SyncLogsSection({
  syncLogs,
  canForceSync,
  syncingCandidateId,
  syncMessage,
  onForceSync,
}: SyncLogsSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all hover:border-slate-300/60">
      <header className="border-b border-slate-100 bg-slate-50/50 px-4 py-2.5">
        <h3 className="text-[14px] font-bold text-slate-900 leading-none">Google Sheets Sync Logs</h3>
        <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Latest candidate updates and reconciliation actions context.</p>
        {syncMessage ? (
          <p className="mt-2.5 inline-flex items-center gap-1.5 rounded border border-amber-100 bg-amber-50/50 px-2 py-1 text-[10px] font-bold text-amber-700 uppercase tracking-tight shadow-sm animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertTriangle className="h-2.5 w-2.5" />
            {syncMessage}
          </p>
        ) : null}
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-slate-50/30">
            <tr className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
              <th className="px-4 py-1.5 border-b border-slate-100 leading-none">Candidate</th>
              <th className="px-3 py-1.5 border-b border-slate-100 leading-none">Status</th>
              <th className="px-3 py-1.5 border-b border-slate-100 leading-none">Synced At</th>
              <th className="px-3 py-1.5 border-b border-slate-100 leading-none">Error</th>
              <th className="px-4 py-1.5 border-b border-slate-100 text-right leading-none">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {syncLogs.length > 0 ? (
              syncLogs.map((log) => (
                <tr key={log.id} className="transition-all hover:bg-slate-50/30">
                  <td className="px-4 py-1.5">
                    <p className="text-[12px] font-bold text-slate-800 leading-none">{log.candidateName}</p>
                    <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none">{log.candidateId}</p>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={[
                      "inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest leading-none",
                      syncStatusTone[log.status]
                    ].join(" ")}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-tight">{toDateTime(log.syncedAt)}</td>
                  <td className="max-w-[330px] px-3 py-1.5 text-[10px] font-semibold text-slate-400 leading-relaxed italic truncate" title={log.errorMessage ?? undefined}>
                    {log.errorMessage ? <span>{log.errorMessage}</span> : <span className="text-slate-300">No issues recorded</span>}
                  </td>
                  <td className="px-4 py-1.5 text-right">
                    {log.status === "FAILED" && canForceSync ? (
                      <button
                        type="button"
                        onClick={() => onForceSync(log.candidateId, log.candidateName)}
                        disabled={syncingCandidateId === log.candidateId}
                        className="inline-flex h-6 items-center gap-1 rounded bg-slate-900 border border-slate-900 px-2 text-[9px] font-bold text-white hover:bg-slate-800 transition-all uppercase tracking-widest shadow-sm disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`h-2.5 w-2.5 ${syncingCandidateId === log.candidateId ? "animate-spin" : ""}`} />
                        {syncingCandidateId === log.candidateId ? "Syncing" : "Force Sync"}
                      </button>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                  No sync activity recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
