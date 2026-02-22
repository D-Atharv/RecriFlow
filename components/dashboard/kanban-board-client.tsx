"use client";

import Link from "next/link";
import { ChevronDown, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { KanbanColumn } from "@/components/dashboard/kanban/kanban-column";
import { CandidatesOverviewMetrics } from "@/components/candidates/list/candidates-overview-metrics";
import { KANBAN_STAGES } from "@/lib/pipeline";
import type { CandidateListItem, Job, PipelineStage } from "@/types/domain";

interface KanbanBoardClientProps {
  candidates: CandidateListItem[];
  jobs: Job[];
  canCreateCandidate: boolean;
}

function groupByStage(candidates: CandidateListItem[]): Record<PipelineStage, CandidateListItem[]> {
  return KANBAN_STAGES.reduce<Record<PipelineStage, CandidateListItem[]>>((acc, stage) => {
    acc[stage] = candidates.filter((candidate) => candidate.currentStage === stage);
    return acc;
  }, {} as Record<PipelineStage, CandidateListItem[]>);
}

export function KanbanBoardClient({ candidates, jobs, canCreateCandidate }: KanbanBoardClientProps) {
  const [boardCandidates, setBoardCandidates] = useState(candidates);
  const [draggingCandidateId, setDraggingCandidateId] = useState<string | null>(null);
  const [dropStage, setDropStage] = useState<PipelineStage | null>(null);
  const [query, setQuery] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("ALL");

  const jobsById = useMemo(() => new Map(jobs.map((job) => [job.id, job])), [jobs]);
  const filteredCandidates = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return boardCandidates.filter((candidate) => {
      if (jobFilter !== "ALL" && candidate.jobId !== jobFilter) {
        return false;
      }

      if (!needle) {
        return true;
      }

      const haystack = [candidate.fullName, candidate.currentRole ?? "", candidate.skills.join(" "), candidate.email]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [boardCandidates, jobFilter, query]);

  const groupedCandidates = useMemo(() => groupByStage(filteredCandidates), [filteredCandidates]);

  useEffect(() => {
    setBoardCandidates(candidates);
  }, [candidates]);

  const moveCandidate = async (candidateId: string, stage: PipelineStage): Promise<void> => {
    const previousState = boardCandidates;

    setBoardCandidates((current) =>
      current.map((candidate) =>
        candidate.id === candidateId
          ? {
            ...candidate,
            currentStage: stage,
          }
          : candidate,
      ),
    );

    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage }),
      });

      if (!response.ok) {
        throw new Error("Failed to move candidate");
      }
    } catch {
      setBoardCandidates(previousState);
    }
  };

  const metrics = useMemo(() => {
    const activePipeline = boardCandidates.filter(
      (candidate) =>
        candidate.currentStage !== "HIRED" &&
        candidate.currentStage !== "REJECTED" &&
        candidate.currentStage !== "WITHDRAWN",
    ).length;
    const hiredCount = boardCandidates.filter((candidate) => candidate.currentStage === "HIRED").length;

    return {
      totalCandidates: boardCandidates.length,
      activePipeline,
      hiredCount,
    };
  }, [boardCandidates]);

  return (
    <div className="space-y-3.5">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-0.5">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight text-slate-800">Pipeline</h1>
          <p className="mt-0.5 text-[10px] font-medium text-slate-400">Track and manage your recruitment pipeline.</p>
        </div>

        <div className="flex items-center justify-end gap-3 flex-1">
          <label className="relative block w-full sm:max-w-[220px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-slate-200/60 bg-white pl-8 pr-3 text-[12px] font-medium text-slate-800 outline-none transition-shadow placeholder:text-slate-400 focus:border-slate-400 focus:shadow-sm"
            />
          </label>

          {canCreateCandidate ? (
            <Link
              href="/candidates/new"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-[11px] font-bold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md uppercase tracking-wider"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Candidate
            </Link>
          ) : null}

          <div className="flex items-center ml-1 border-l border-slate-100 pl-4">
            <CandidatesOverviewMetrics
              totalCandidates={metrics.totalCandidates}
              activePipeline={metrics.activePipeline}
              hiredCount={metrics.hiredCount}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-100 bg-white/30 py-1 mb-2">
        <div className="flex flex-wrap items-center gap-1">
          <div className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <SlidersHorizontal className="h-3 w-3" />
            <span>Filter</span>
          </div>

          <select
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
            className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 outline-none transition-colors hover:border-slate-300 focus:border-slate-400"
          >
            <option value="ALL">Role: All Open Roles</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setJobFilter("ALL");
              setQuery("");
            }}
            className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-slate-600"
          >
            Clear
          </button>
        </div>
      </section>

      <section className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-6">
          {KANBAN_STAGES.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              candidates={groupedCandidates[stage]}
              jobsById={jobsById}
              isDropTarget={dropStage === stage}
              onDragStart={(candidateId) => {
                setDraggingCandidateId(candidateId);
              }}
              onDragEnd={() => {
                setDraggingCandidateId(null);
                setDropStage(null);
              }}
              onDragOver={(targetStage) => {
                setDropStage(targetStage);
              }}
              onDrop={async (targetStage) => {
                if (!draggingCandidateId) {
                  return;
                }

                const candidate = boardCandidates.find((item) => item.id === draggingCandidateId);
                if (!candidate || candidate.currentStage === targetStage) {
                  setDraggingCandidateId(null);
                  setDropStage(null);
                  return;
                }

                await moveCandidate(draggingCandidateId, targetStage);
                setDraggingCandidateId(null);
                setDropStage(null);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
