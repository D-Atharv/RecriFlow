import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { CandidateCard } from "@/components/dashboard/candidate-card";
import { STAGE_THEME } from "@/components/dashboard/kanban/stage-theme";
import { STAGE_LABELS } from "@/lib/pipeline";
import type { CandidateListItem, Job, PipelineStage } from "@/types/domain";

interface KanbanColumnProps {
  stage: PipelineStage;
  candidates: CandidateListItem[];
  jobsById: Map<string, Job>;
  isDropTarget: boolean;
  onDragOver: (stage: PipelineStage) => void;
  onDrop: (stage: PipelineStage) => void;
  onDragStart: (candidateId: string) => void;
  onDragEnd: () => void;
}

export function KanbanColumn({
  stage,
  candidates,
  jobsById,
  isDropTarget,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
}: KanbanColumnProps) {
  const stageTheme = STAGE_THEME[stage];

  return (
    <section className="w-[280px] shrink-0">
      <header className="mb-2.5 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[13px] font-bold tracking-tight text-slate-800">{STAGE_LABELS[stage]}</h3>
          <span className={["rounded px-1.5 py-0.5 text-[10px] font-bold", stageTheme.badgeClass].join(" ")}>
            {candidates.length}
          </span>
        </div>
        <button type="button" className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          onDragOver(stage);
        }}
        onDrop={(event) => {
          event.preventDefault();
          onDrop(stage);
        }}
        className={[
          "flex h-[calc(100vh-230px)] flex-col overflow-y-auto rounded-xl border border-slate-200/60 border-t-4 bg-slate-50/50 p-2.5 transition-all shadow-sm",
          stageTheme.columnAccentClass,
          isDropTarget ? "ring-2 ring-slate-300 ring-offset-2" : "",
        ].join(" ")}
      >
        <div className="flex-1 space-y-2.5">
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                job={jobsById.get(candidate.jobId)}
                draggable
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white/50 px-3 py-6 text-center text-[11px] font-medium text-slate-400 italic">
              No candidates in this stage.
            </div>
          )}
        </div>

        <Link
          href="/candidates/new"
          className="mt-2.5 flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/50 py-2 text-[11px] font-bold text-slate-400 transition-all hover:border-slate-400 hover:bg-white hover:text-slate-600 shadow-sm"
        >
          + New Lead
        </Link>
      </div>
    </section>
  );
}
