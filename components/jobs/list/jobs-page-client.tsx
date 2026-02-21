"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { JobsDataTable } from "@/components/jobs/list/jobs-data-table";
import { JobsFilterBar } from "@/components/jobs/list/jobs-filter-bar";
import { JobsGrid } from "@/components/jobs/list/jobs-grid";
import type { JobDepartmentOption, JobFiltersState, JobListItem, JobManagerOption } from "@/components/jobs/list/types";
import type { JobStatus } from "@/types/domain";

interface JobsPageClientProps {
  initialItems: JobListItem[];
  managers: JobManagerOption[];
  canManage: boolean;
}

function toDepartmentOptions(items: JobListItem[]): JobDepartmentOption[] {
  const unique = new Set(items.map((item) => item.job.department));

  return Array.from(unique)
    .sort((a, b) => a.localeCompare(b))
    .map((department) => ({
      id: department,
      label: department,
    }));
}

export function JobsPageClient({ initialItems, managers, canManage }: JobsPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFiltersState>({
    query: "",
    status: "ALL",
    department: "ALL",
    managerId: "ALL",
    viewMode: "table",
  });

  const departments = useMemo(() => toDepartmentOptions(items), [items]);
  const metrics = useMemo(() => {
    const totalOpenings = items.length;
    const activePipeline = items.reduce((acc, item) => acc + item.activeCandidates, 0);
    const jobsAtRisk = items.filter((item) => item.job.status === "OPEN" && item.activeCandidates < 2).length;
    const closedJobs = items.filter((item) => item.job.status === "CLOSED").length;

    return {
      totalOpenings,
      activePipeline,
      jobsAtRisk,
      closedJobs,
    };
  }, [items]);

  const filteredRows = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return items.filter((item) => {
      if (filters.status !== "ALL" && item.job.status !== filters.status) {
        return false;
      }

      if (filters.department !== "ALL" && item.job.department !== filters.department) {
        return false;
      }

      if (filters.managerId !== "ALL" && item.job.createdById !== filters.managerId) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [item.job.title, item.job.department, item.managerName, item.job.requiredSkills.join(" ")]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [filters, items]);

  const handleStatusChange = async (jobId: string, status: JobStatus): Promise<void> => {
    setError(null);

    const previous = items;
    setItems((current) =>
      current.map((item) =>
        item.id === jobId
          ? {
            ...item,
            job: {
              ...item.job,
              status,
            },
          }
          : item,
      ),
    );

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to update job status");
      }
    } catch (updateError) {
      setItems(previous);
      setError(updateError instanceof Error ? updateError.message : "Failed to update job status");
    }
  };

  return (
    <div className="space-y-4">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-slate-800">Job Openings</h1>
          <p className="mt-0.5 text-[11px] text-slate-400">Manage your hiring pipeline and job postings.</p>
        </div>

        <div className="flex items-center justify-end gap-3 flex-1">
          <label className="relative block w-full sm:max-w-[240px]">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-300" />
            <input
              value={filters.query}
              onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
              placeholder="Search jobs..."
              className="h-9 w-full rounded-xl border border-slate-200/60 bg-white pl-8 pr-3 text-xs text-gray-900 outline-none transition-shadow placeholder:text-gray-400 focus:border-slate-500/50 focus:shadow-sm"
            />
          </label>



          {canManage ? (
            <Link
              href="/jobs/new"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#1e293b] px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Job
            </Link>
          ) : null}

          <div className="flex items-center gap-4 ml-2">
            <article className="border-r border-gray-150 pr-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Openings</p>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-slate-800">{metrics.totalOpenings}</p>
            </article>
            <article className="border-r border-gray-150 pr-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Active Pipeline</p>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-slate-800">{metrics.activePipeline}</p>
            </article>
            <article className="border-r border-gray-150 pr-4">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">At Risk</p>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-amber-600">{metrics.jobsAtRisk}</p>
            </article>
            <article>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Closed</p>
              <p className="mt-0.5 text-lg font-bold tracking-tight text-slate-500">{metrics.closedJobs}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Metrics section removed from here */}

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : null}

      <JobsFilterBar filters={filters} departments={departments} managers={managers} onFiltersChange={setFilters} />

      {filters.viewMode === "table" ? (
        <JobsDataTable rows={filteredRows} canManage={canManage} onStatusChange={handleStatusChange} />
      ) : (
        <JobsGrid rows={filteredRows} canManage={canManage} onStatusChange={handleStatusChange} />
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white px-5 py-2 text-[12px] text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {filteredRows.length === 0 ? 0 : 1} to {filteredRows.length} of {items.length} results
        </p>
        <div className="inline-flex items-center gap-1 text-[11px] font-medium">
          <button
            type="button"
            aria-label="Previous page"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/60 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button type="button" className="h-7 min-w-7 rounded-lg bg-[#1e293b] px-2 text-white font-semibold">
            1
          </button>
          <button type="button" className="h-7 min-w-7 rounded-lg border border-slate-200/60 px-2 text-slate-600 hover:bg-slate-50 font-medium transition-colors">
            2
          </button>
          <button type="button" className="h-7 min-w-7 rounded-lg border border-slate-200/60 px-2 text-slate-600 hover:bg-slate-50 font-medium transition-colors">
            3
          </button>
          <button
            type="button"
            aria-label="Next page"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/60 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
