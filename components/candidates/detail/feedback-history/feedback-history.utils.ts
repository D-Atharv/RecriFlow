import type { SessionUser } from "@/types/auth";
import type { Candidate, InterviewRound } from "@/types/domain";

export function canSubmitRoundFeedback(round: InterviewRound, viewer: SessionUser): boolean {
  return viewer.role === "ADMIN" || viewer.id === round.interviewerId;
}

export function getNextPendingRoundForViewer(candidate: Candidate, viewer: SessionUser): InterviewRound | null {
  const pendingRounds = candidate.rounds
    .filter((round) => !round.feedback)
    .sort((a, b) => a.roundNumber - b.roundNumber);

  return pendingRounds.find((round) => canSubmitRoundFeedback(round, viewer)) ?? null;
}
