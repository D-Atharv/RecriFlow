import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

import { CANDIDATE_SOURCES, PIPELINE_STAGES } from "@/types/domain";

interface CandidatesFilterBarProps {
  stage: string;
  source: string;
  viewMode: "table" | "grid";
  onStageChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onViewModeChange: (mode: "table" | "grid") => void;
}

export function CandidatesFilterBar({
  stage,
  source,
  viewMode,
  onStageChange,
  onSourceChange,
  onViewModeChange,
}: CandidatesFilterBarProps) {
  return (
    <section className="border-b border-slate-100 bg-white/30 py-1 mb-2">
      <div className="flex flex-wrap items-center gap-1">
        <div className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
          <SlidersHorizontal className="h-3 w-3" />
          <span>Filter</span>
        </div>

        <select
          value={stage}
          onChange={(event) => onStageChange(event.target.value)}
          className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 outline-none transition-colors hover:border-slate-300 focus:border-slate-400"
        >
          <option value="ALL">Status: All</option>
          {PIPELINE_STAGES.map((item) => (
            <option key={item} value={item}>
              {item.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <select
          className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 outline-none transition-colors hover:border-slate-300 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
          defaultValue="ALL"
          disabled
        >
          <option value="ALL">Role: Any</option>
        </select>

        <select
          value={source}
          onChange={(event) => onSourceChange(event.target.value)}
          className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600 outline-none transition-colors hover:border-slate-300 focus:border-slate-400"
        >
          <option value="ALL">Source: All</option>
          {CANDIDATE_SOURCES.map((item) => (
            <option key={item} value={item}>
              {item.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <div className="ml-auto inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewModeChange("table")}
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded transition-all",
              viewMode === "table" ? "bg-slate-100 text-slate-800 shadow-sm" : "text-slate-400 hover:bg-slate-50",
            ].join(" ")}
            aria-label="List view"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={[
              "inline-flex h-7 w-7 items-center justify-center rounded transition-all",
              viewMode === "grid" ? "bg-slate-100 text-slate-800 shadow-sm" : "text-slate-400 hover:bg-slate-50",
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
