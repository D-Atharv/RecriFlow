"use client";

import { useMemo, useState } from "react";

import { STAGE_LABELS } from "@/lib/pipeline";
import type { SessionUser } from "@/types/auth";
import type { Candidate } from "@/types/domain";

import { FeedbackRoundCard } from "@/components/candidates/detail/feedback-history/feedback-round-card";

interface CandidateFeedbackHistoryProps {
  candidate: Candidate;
  viewer: SessionUser;
}

export function CandidateFeedbackHistory({ candidate, viewer }: CandidateFeedbackHistoryProps) {
  const rounds = useMemo(
    () => [...candidate.rounds].sort((a, b) => b.roundNumber - a.roundNumber),
    [candidate.rounds],
  );

  const defaultExpandedRound = rounds.find((round) => round.feedback)?.id ?? null;
  const [expandedRoundId, setExpandedRoundId] = useState<string | null>(defaultExpandedRound);

  return (
    <section className="space-y-2">
      <header className="flex flex-wrap items-center justify-between gap-1 px-1 mb-1">
        <div>
          <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase">
            Feedback History
          </h2>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Consolidated interview scorecards</p>
        </div>

        <span className="rounded border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600 uppercase tracking-widest ring-1 ring-emerald-100/30">
          {STAGE_LABELS[candidate.currentStage]}
        </span>
      </header>

      {rounds.length === 0 ? (
        <article className="rounded border border-slate-100 bg-slate-50/30 p-2.5 text-[10px] font-bold text-slate-300 uppercase italic tracking-widest">
          No rounds recorded.
        </article>
      ) : (
        <div className="space-y-2">
          {rounds.map((round) => {
            const isExpanded = expandedRoundId === round.id;
            return (
              <FeedbackRoundCard
                key={round.id}
                candidateId={candidate.id}
                round={round}
                rejection={candidate.rejection}
                viewer={viewer}
                expanded={isExpanded}
                onToggle={() => setExpandedRoundId((current) => (current === round.id ? null : round.id))}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
