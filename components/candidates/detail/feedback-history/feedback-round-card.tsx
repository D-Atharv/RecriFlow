import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

import { formatDate } from "@/lib/dates";
import type { SessionUser } from "@/types/auth";
import type { InterviewRound, RejectionReason } from "@/types/domain";

import { formatEnumLabel, getCandidateInitials } from "@/components/candidates/detail/candidate-detail.utils";
import { FeedbackRecommendationBadge } from "@/components/candidates/detail/feedback-history/feedback-recommendation-badge";
import { FeedbackScorePill } from "@/components/candidates/detail/feedback-history/feedback-score-pill";

interface FeedbackRoundCardProps {
  candidateId: string;
  round: InterviewRound;
  viewer: SessionUser;
  rejection: RejectionReason | null;
  expanded: boolean;
  onToggle: () => void;
}

function extractPoints(value: string): string[] {
  const byLines = value
    .split(/\r?\n/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (byLines.length > 1) {
    return byLines.slice(0, 4);
  }

  return value
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function isFeedbackOwner(viewer: SessionUser, round: InterviewRound): boolean {
  return viewer.role === "ADMIN" || viewer.id === round.interviewerId;
}

function formatRoundMeta(round: InterviewRound): string {
  if (round.feedback) {
    return `${formatDate(round.feedback.submittedAt)} · ${round.interviewerName}`;
  }

  return `${formatDate(round.scheduledAt)} · ${round.interviewerName}`;
}

export function FeedbackRoundCard({ candidateId, round, viewer, rejection, expanded, onToggle }: FeedbackRoundCardProps) {
  const canSubmitFeedback = isFeedbackOwner(viewer, round);
  const rejectionFromRound = Boolean(round.feedback && rejection?.feedbackId === round.feedback.id);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200/60 bg-white">
      <div className="flex flex-col gap-1.5 p-2">
        <div className="flex flex-wrap items-start justify-between gap-1.5 font-bold">
          <div className="flex items-start gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200/50">
              {getCandidateInitials(round.interviewerName)}
            </span>

            <div>
              <h3 className="text-[13px] font-bold tracking-tight text-slate-800 leading-tight">
                Round {round.roundNumber}: {formatEnumLabel(round.roundType)}
              </h3>
              <p className="mt-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-tight">{formatRoundMeta(round)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {round.feedback ? (
              <FeedbackRecommendationBadge recommendation={round.feedback.recommendation} />
            ) : (
              <span className="rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                {formatEnumLabel(round.status)}
              </span>
            )}

            {round.feedback ? (
              <button
                type="button"
                onClick={onToggle}
                className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 uppercase tracking-widest border border-transparent hover:border-slate-100"
              >
                {expanded ? "Hide" : "Details"}
                {expanded ? <ChevronUp className="h-2.5 w-2.5" /> : <ChevronDown className="h-2.5 w-2.5" />}
              </button>
            ) : null}
          </div>
        </div>

        {round.feedback ? (
          <div className="grid gap-1.5 border-t border-slate-100/60 pt-2 sm:grid-cols-2 lg:grid-cols-5">
            <FeedbackScorePill label="Tech" value={round.feedback.technicalRating} />
            <FeedbackScorePill label="Comm" value={round.feedback.communicationRating} />
            <FeedbackScorePill label="Problem" value={round.feedback.problemSolvingRating} />
            <FeedbackScorePill label="Culture" value={round.feedback.cultureFitRating} />
            <FeedbackScorePill label="Overall" value={round.feedback.overallRating} />
          </div>
        ) : (
          <div className="border-t border-slate-100/60 pt-2">
            {canSubmitFeedback ? (
              <Link
                href={`/candidates/${candidateId}/rounds/${round.id}/feedback`}
                className="inline-flex h-7 items-center rounded border border-slate-200 bg-slate-50/50 px-2.5 text-[9px] font-bold text-slate-600 transition-all hover:bg-slate-100 uppercase tracking-widest"
              >
                Submit feedback
              </Link>
            ) : (
              <p className="text-[10px] font-bold text-slate-300 uppercase italic tracking-widest">Awaiting submission.</p>
            )}
          </div>
        )}
      </div>

      {round.feedback && expanded ? (
        <div className="space-y-2.5 border-t border-slate-100/60 bg-slate-50/30 px-2 py-2">
          <div className="grid gap-3 md:grid-cols-2">
            <section className="space-y-1">
              <h4 className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Key strengths</h4>
              <ul className="space-y-1 text-[10.5px] text-slate-600 leading-relaxed font-bold">
                {extractPoints(round.feedback.strengthsText).map((point) => (
                  <li key={point} className="flex gap-2 items-start opacity-90">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-1">
              <h4 className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Areas for growth</h4>
              <ul className="space-y-1 text-[10.5px] text-slate-600 leading-relaxed font-bold">
                {extractPoints(round.feedback.improvementText).map((point) => (
                  <li key={point} className="flex gap-2 items-start opacity-90">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="space-y-1 font-bold">
            <h4 className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Final summary</h4>
            <p className="rounded border border-slate-100/80 bg-white px-2 py-1.5 text-[11px] italic text-slate-500 font-bold leading-relaxed shadow-sm">
              Recommendation: {formatEnumLabel(round.feedback.recommendation)} · {round.feedback.overallRating}/5
            </p>
          </section>
        </div>
      ) : null}
    </article>
  );
}
