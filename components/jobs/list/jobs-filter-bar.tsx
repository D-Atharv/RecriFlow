import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

import type { JobDepartmentOption, JobFiltersState, JobManagerOption } from "@/components/jobs/list/types";
import { JOB_STATUSES } from "@/types/domain";

interface JobsFilterBarProps {
  filters: JobFiltersState;
  departments: JobDepartmentOption[];
  managers: JobManagerOption[];
  onFiltersChange: (next: JobFiltersState) => void;
}

const STATUS_LABELS = {
  OPEN: "Published",
  ON_HOLD: "Draft",
  CLOSED: "Closed",
} as const;

export function JobsFilterBar({ filters, departments, managers, onFiltersChange }: JobsFilterBarProps) {
  return (
    <section className="border-b border-slate-100 bg-white/50 py-1 transition-all">
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <SlidersHorizontal className="h-3 w-3" />
          <span>Filter</span>
        </div>

        <select
          value={filters.status}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              status: event.target.value as JobFiltersState["status"],
            })
          }
          className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 outline-none transition-all hover:border-slate-300 focus:border-slate-500/50"
        >
          <option value="ALL">Status: All</option>
          {Object.entries(STATUS_LABELS).map(([status, label]) => (
            <option key={status} value={status}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={filters.department}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              department: event.target.value,
            })
          }
          className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 outline-none transition-all hover:border-slate-300 focus:border-slate-500/50"
        >
          <option value="ALL">Role: Any</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.label}
            </option>
          ))}
        </select>

        <select
          value={filters.managerId}
          onChange={(event) =>
            onFiltersChange({
              ...filters,
              managerId: event.target.value,
            })
          }
          className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 outline-none transition-all hover:border-slate-300 focus:border-slate-500/50"
        >
          <option value="ALL">Manager: Any</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            onFiltersChange({
              ...filters,
              status: "ALL",
              department: "ALL",
              managerId: "ALL",
              query: "",
            })
          }
          className="px-2 text-[11px] font-semibold text-slate-400 transition-colors hover:text-slate-600"
        >
          Clear
        </button>

        <div className="ml-auto inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onFiltersChange({ ...filters, viewMode: "table" })}
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all",
              filters.viewMode === "table" ? "bg-slate-100 text-slate-800 shadow-sm" : "text-slate-400 hover:bg-slate-50",
            ].join(" ")}
            aria-label="List view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFiltersChange({ ...filters, viewMode: "grid" })}
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded-lg transition-all",
              filters.viewMode === "grid" ? "bg-slate-100 text-slate-800 shadow-sm" : "text-slate-400 hover:bg-slate-50",
            ].join(" ")}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
