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

  const STAGE_COLORS: Record<string, { badge: string; border: string }> = {
    SOURCING: { badge: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300", border: "" },
    SCREENING: { badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300", border: "border-t-4 border-blue-500" },
    TECHNICAL_L1: { badge: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300", border: "border-t-4 border-indigo-500" },
    TECHNICAL_L2: { badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300", border: "border-t-4 border-purple-500" },
    CULTURE_FIT: { badge: "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300", border: "border-t-4 border-pink-500" },
    OFFER_EXTENDED: { badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300", border: "border-t-4 border-green-500" },
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-gray-400 font-normal">Pipeline /</span>
            All Candidates
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-64 transition-all"
              placeholder="Search candidates..."
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-gray-50 dark:bg-background-dark">
        <div className="flex h-full gap-6 min-w-max">
          {KANBAN_STAGES.map((stage) => {
            const colors = STAGE_COLORS[stage] || STAGE_COLORS.SOURCING;
            const stageCandidates = grouped[stage] ?? [];

            return (
              <div key={stage} className="flex flex-col w-80 h-full">
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">{STAGE_LABELS[stage]}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
                      {stageCandidates.length}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <span className="material-symbols-outlined text-sm">more_horiz</span>
                  </button>
                </div>

                <div className={`flex-1 bg-gray-100/50 dark:bg-gray-800/30 rounded-xl p-2 overflow-y-auto space-y-3 scrollbar-hide ${colors.border}`}>
                  {stageCandidates.map((candidate) => (
                    <CandidateCard key={candidate.id} candidate={candidate} job={jobMap.get(candidate.jobId)} />
                  ))}
                  <button className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600 transition flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span> New Lead
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col w-80 h-full opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200">Hired / Rejected</h3>
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs font-medium">Archived</span>
              </div>
            </div>
            <div className="flex-1 bg-gray-100/30 dark:bg-gray-800/30 rounded-xl p-2 border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-gray-400">inventory_2</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Archived</p>
              <p className="text-xs text-gray-500 mb-4">View past hires for these roles</p>
              <button className="text-primary text-xs font-medium hover:underline">View History</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
