"use client";

import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CandidatesDataTable } from "@/components/candidates/list/candidates-data-table";
import { CandidatesFilterBar } from "@/components/candidates/list/candidates-filter-bar";
import { CandidatesGrid } from "@/components/candidates/list/candidates-grid";
import { CandidatesOverviewMetrics } from "@/components/candidates/list/candidates-overview-metrics";
import type { Candidate, Job, PipelineStage } from "@/types/domain";

interface CandidatesTableClientProps {
  candidates: Candidate[];
  jobs: Job[];
  canManage: boolean;
}

function normalizeCandidate(candidate: Candidate): Candidate {
  return {
    ...candidate,
    skills: Array.isArray(candidate.skills) ? candidate.skills : [],
    rounds: Array.isArray(candidate.rounds) ? candidate.rounds : [],
  };
}

function getLatestRating(candidate: Candidate): number | null {
  const completedRounds = (candidate.rounds ?? []).filter((round) => round.feedback);
  if (completedRounds.length === 0) {
    return null;
  }

  const latest = completedRounds
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .at(0);

  return latest?.feedback?.overallRating ?? null;
}

export function CandidatesTableClient({ candidates, jobs, canManage }: CandidatesTableClientProps) {
  const router = useRouter();
  const normalizedCandidates = useMemo(() => candidates.map(normalizeCandidate), [candidates]);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string>("ALL");
  const [source, setSource] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [actionError, setActionError] = useState<string | null>(null);
  const [candidatesState, setCandidatesState] = useState<Candidate[]>(normalizedCandidates);

  useEffect(() => {
    setCandidatesState(normalizedCandidates);
  }, [normalizedCandidates]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function hydrateCandidates(): Promise<void> {
      try {
        const response = await fetch("/api/candidates", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { candidates?: Candidate[] };
        if (!mounted || !Array.isArray(payload.candidates)) {
          return;
        }

        setCandidatesState(payload.candidates.map(normalizeCandidate));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Candidates hydration refresh failed", error);
      }
    }

    void hydrateCandidates();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const jobMap = useMemo(() => new Map(jobs.map((job) => [job.id, job])), [jobs]);

  const filteredCandidates = useMemo(() => {
    return candidatesState.filter((candidate) => {
      if (stage !== "ALL" && candidate.currentStage !== stage) {
        return false;
      }

      if (source !== "ALL" && candidate.source !== source) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const haystack = [candidate.fullName, candidate.email, candidate.currentRole ?? "", candidate.skills.join(" ")]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query.trim().toLowerCase());
    });
  }, [candidatesState, query, source, stage]);

  const rows = useMemo(
    () =>
      filteredCandidates.map((candidate) => ({
        candidate,
        job: jobMap.get(candidate.jobId),
        latestRating: getLatestRating(candidate),
      })),
    [filteredCandidates, jobMap],
  );

  const metrics = useMemo(() => {
    const activePipeline = candidatesState.filter(
      (candidate) =>
        candidate.currentStage !== "HIRED" &&
        candidate.currentStage !== "REJECTED" &&
        candidate.currentStage !== "WITHDRAWN",
    ).length;
    const hiredCount = candidatesState.filter((candidate) => candidate.currentStage === "HIRED").length;

    return {
      totalCandidates: candidatesState.length,
      activePipeline,
      hiredCount,
    };
  }, [candidatesState]);

  const firstRow = rows.length === 0 ? 0 : 1;
  const lastRow = rows.length;

  const updateCandidateStage = async (candidate: Candidate, nextStage: PipelineStage): Promise<void> => {
    setActionError(null);
    const previous = candidatesState;

    setCandidatesState((current) =>
      current.map((item) =>
        item.id === candidate.id
          ? {
            ...item,
            currentStage: nextStage,
          }
          : item,
      ),
    );

    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stage: nextStage,
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to update candidate stage");
      }

      router.refresh();
    } catch (error) {
      setCandidatesState(previous);
      setActionError(error instanceof Error ? error.message : "Failed to update candidate stage");
    }
  };

  const archiveCandidate = async (candidate: Candidate): Promise<void> => {
    await updateCandidateStage(candidate, "WITHDRAWN");
  };

  return (
    <div className="space-y-3.5">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-0.5">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight text-slate-800">Candidates</h1>
          <p className="mt-0.5 text-[10px] font-medium text-slate-400">
            Manage and track your recruitment pipeline.
          </p>
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

          {canManage ? (
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

      {actionError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {actionError}
        </div>
      ) : null}

      <div className="space-y-4">
        <CandidatesFilterBar
          stage={stage}
          source={source}
          viewMode={viewMode}
          onStageChange={setStage}
          onSourceChange={setSource}
          onViewModeChange={setViewMode}
        />

        {viewMode === "table" ? (
          <CandidatesDataTable
            rows={rows}
            canManage={canManage}
            onAdvanceStage={updateCandidateStage}
            onArchiveCandidate={archiveCandidate}
          />
        ) : (
          <CandidatesGrid
            rows={rows}
            canManage={canManage}
            onAdvanceStage={updateCandidateStage}
            onArchiveCandidate={archiveCandidate}
          />
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-slate-50/30 px-5 py-2.5 text-[11px] font-medium text-slate-400 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {firstRow} to {lastRow} of {candidatesState.length} results
        </p>
        <div className="inline-flex items-center rounded-lg border border-slate-200 overflow-hidden bg-white">
          <button
            type="button"
            aria-label="Previous page"
            className="h-7 w-7 border-r border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5 m-auto" />
          </button>
          <button type="button" className="h-7 min-w-[28px] bg-slate-900 px-2 text-white font-bold">
            1
          </button>
          <button type="button" className="h-7 min-w-[28px] border-r border-slate-200 px-2 text-slate-600 hover:bg-slate-50 font-bold transition-colors">
            2
          </button>
          <button type="button" className="h-7 min-w-[28px] border-r border-slate-200 px-2 text-slate-600 hover:bg-slate-50 font-bold transition-colors">
            3
          </button>
          <button
            type="button"
            aria-label="Next page"
            className="h-7 w-7 text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5 m-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}
