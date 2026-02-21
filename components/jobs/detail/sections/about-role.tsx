"use client";

import { CheckCircle2 } from "lucide-react";
import type { Job } from "@/types/domain";

interface AboutRoleProps {
  job: Job;
}

function normalizeLine(value: string): string {
  return value.replace(/^[-*•]\s*/, "").trim();
}

function buildResponsibilities(description: string): string[] {
  const lines = description
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean)
    .filter((line) => !/^core responsibilities:?$/i.test(line));

  if (lines.length >= 2) {
    return lines.slice(0, 6);
  }

  return description
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export function AboutRole({ job }: AboutRoleProps) {
  const storedResponsibilities = Array.isArray(job.coreResponsibilities) ? job.coreResponsibilities : [];
  const responsibilities =
    storedResponsibilities.length > 0 ? storedResponsibilities : buildResponsibilities(job.description ?? "");

  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-1.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">About the Role</h3>
        <p className="whitespace-pre-wrap text-[11px] font-semibold leading-relaxed text-slate-500">{job.description}</p>
      </section>

      <section>
        <h3 className="mb-2.5 text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">Core Responsibilities</h3>
        {responsibilities.length > 0 ? (
          <ul className="space-y-2">
            {responsibilities.map((item, idx) => (
              <li key={`${item}-${idx}`} className="flex items-start gap-2">
                <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/50 ring-1 ring-emerald-500/10">
                  <CheckCircle2 className="h-2 w-2" />
                </div>
                <p className="text-[11px] font-semibold leading-relaxed text-slate-500">{item}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No context recorded.</p>
        )}
      </section>
    </div>
  );
}
