"use client";

import { useMemo, useState } from "react";

import { CandidateCard } from "@/components/dashboard/candidate-card";
import { KANBAN_STAGES, STAGE_LABELS } from "@/lib/pipeline";
import type { Candidate, Job } from "@/types/domain";

interface KanbanBoardClientProps {
  candidates: Candidate[];
  jobs: Job[];
}

export function KanbanBoardClient({ candidates, jobs }: KanbanBoardClientProps) {
  const [query, setQuery] = useState("");

  const jobMap = useMemo(() => {
    return new Map(jobs.map((job) => [job.id, job]));
  }, [jobs]);

  const filteredCandidates = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      return candidates;
    }

    return candidates.filter((candidate) => {
      const haystack = [
        candidate.fullName,
        candidate.email,
        candidate.currentRole ?? "",
        candidate.currentCompany ?? "",
        candidate.skills.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(trimmed);
    });
  }, [candidates, query]);

  const grouped = useMemo(() => {
    return KANBAN_STAGES.reduce<Record<string, Candidate[]>>((acc, stage) => {
      acc[stage] = filteredCandidates.filter((candidate) => candidate.currentStage === stage);
      return acc;
    }, {});
  }, [filteredCandidates]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Pipeline Visibility</p>
          <p className="text-xs text-[color:var(--color-ink-soft)]">Server-rendered data, client-side filtering.</p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search candidates..."
          className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm outline-none ring-offset-0 placeholder:text-[color:var(--color-ink-muted)] focus:border-[color:var(--color-primary)] sm:max-w-xs"
        />
      </div>

      <div className="grid gap-4 overflow-x-auto pb-1 md:grid-cols-2 xl:grid-cols-4">
        {KANBAN_STAGES.map((stage) => (
          <section
            key={stage}
            className="min-h-[220px] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[color:var(--color-ink)]">{STAGE_LABELS[stage]}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-[color:var(--color-ink-soft)]">
                {grouped[stage]?.length ?? 0}
              </span>
            </div>

            <div className="space-y-3">
              {(grouped[stage] ?? []).map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} job={jobMap.get(candidate.jobId)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
