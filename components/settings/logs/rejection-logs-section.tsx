"use client";

import { ArrowUpRight } from "lucide-react";

import { toDateTime, toReadableCategory } from "@/components/settings/logs/log-utils";
import type { SettingsRejectionItem } from "@/components/settings/types";

interface RejectionLogsSectionProps {
  rejections: SettingsRejectionItem[];
}

export function RejectionLogsSection({ rejections }: RejectionLogsSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm transition-all hover:border-slate-300/60">
      <header className="border-b border-slate-100 bg-slate-50/50 px-4 py-2.5">
        <h3 className="text-[14px] font-bold text-slate-900 leading-none">Rejection Analysis Log</h3>
        <p className="mt-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Structured rejection reasons context for pipeline quality audits.</p>
      </header>

      <div className="divide-y divide-slate-50/80">
        {rejections.length > 0 ? (
          rejections.map((item) => (
            <article key={item.id} className="px-4 py-2.5 transition-all hover:bg-slate-50/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800 leading-none">{item.candidateName}</h4>
                  <p className="mt-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none">{item.candidateId}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-rose-50 text-rose-700 border border-rose-100/50">
                    {toReadableCategory(item.category)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {toDateTime(item.createdAt)}
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-50" />
                  </span>
                </div>
              </div>
              <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-500 italic">{item.notes}</p>
            </article>
          ))
        ) : (
          <div className="px-5 py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No rejection records identified yet.</div>
        )}
      </div>
    </section>
  );
}
