"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { getNextPipelineStage, STAGE_LABELS } from "@/lib/pipeline";
import type { PipelineStage } from "@/types/domain";

interface CandidateAdvanceStageButtonProps {
  candidateId: string;
  currentStage: PipelineStage;
}

export function CandidateAdvanceStageButton({ candidateId, currentStage }: CandidateAdvanceStageButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const nextStage = useMemo(() => getNextPipelineStage(currentStage), [currentStage]);

  const handleAdvance = () => {
    if (!nextStage) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/candidates/${candidateId}`, {
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
          throw new Error(payload.error ?? "Failed to advance stage");
        }

        router.refresh();
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Failed to advance stage");
      }
    });
  };

  if (!nextStage) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-[11px] font-semibold text-slate-400"
      >
        Final Stage
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleAdvance}
        disabled={isPending}
        className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-3 text-[11px] font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Updating..." : `Advance to ${STAGE_LABELS[nextStage].split(':')[0]}`}
      </button>
      {error ? <p className="max-w-[220px] text-right text-[10px] font-semibold text-rose-600">{error}</p> : null}
    </div>
  );
}
