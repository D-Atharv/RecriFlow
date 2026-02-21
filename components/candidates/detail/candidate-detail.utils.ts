import { STAGE_LABELS } from "@/lib/pipeline";
import type { Candidate } from "@/types/domain";

export type CandidateActivityKind =
  | "application"
  | "round_scheduled"
  | "feedback_submitted"
  | "stage_updated"
  | "rejected";

export interface CandidateActivityItem {
  id: string;
  kind: CandidateActivityKind;
  title: string;
  description: string;
  timestamp: string;
}

export function formatEnumLabel(value: string): string {
  return value
    .split("_")
    .map((token) => token.charAt(0) + token.slice(1).toLowerCase())
    .join(" ");
}

export function getCandidateInitials(fullName: string): string {
  const tokens = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (tokens.length === 0) {
    return "NA";
  }

  return tokens.map((token) => token.charAt(0).toUpperCase()).join("");
}

export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function deriveMatchScore(candidate: Candidate): number {
  const feedbackScores = candidate.rounds
    .filter((round) => round.feedback)
    .map((round) => round.feedback?.overallRating ?? 0);

  if (feedbackScores.length > 0) {
    const average = feedbackScores.reduce((acc, value) => acc + value, 0) / feedbackScores.length;
    return Math.min(99, Math.max(45, Math.round(average * 20)));
  }

  let score = 42;
  score += Math.min(candidate.skills.length, 8) * 5;
  score += Math.min(candidate.totalExperienceYrs ?? 0, 12) * 2;

  if (candidate.linkedinUrl) {
    score += 4;
  }
  if (candidate.currentRole) {
    score += 4;
  }
  if (candidate.currentCompany) {
    score += 3;
  }

  return Math.max(35, Math.min(96, Math.round(score)));
}

export function buildCandidateActivity(candidate: Candidate): CandidateActivityItem[] {
  const events: CandidateActivityItem[] = [
    {
      id: `application-${candidate.id}`,
      kind: "application",
      title: "Application Received",
      description: `Source: ${formatEnumLabel(candidate.source)}`,
      timestamp: candidate.createdAt,
    },
  ];

  for (const round of candidate.rounds) {
    if (round.scheduledAt) {
      events.push({
        id: `scheduled-${round.id}`,
        kind: "round_scheduled",
        title: `Round ${round.roundNumber} Scheduled`,
        description: `${formatEnumLabel(round.roundType)} with ${round.interviewerName}`,
        timestamp: round.scheduledAt,
      });
    }

    if (round.feedback) {
      events.push({
        id: `feedback-${round.feedback.id}`,
        kind: "feedback_submitted",
        title: `Feedback Submitted · Round ${round.roundNumber}`,
        description: `Recommendation: ${formatEnumLabel(round.feedback.recommendation)} · ${round.feedback.overallRating}/5`,
        timestamp: round.feedback.submittedAt,
      });
    }
  }

  events.push({
    id: `stage-${candidate.id}-${candidate.stageUpdatedAt}`,
    kind: "stage_updated",
    title: "Stage Updated",
    description: `Moved to ${STAGE_LABELS[candidate.currentStage]}`,
    timestamp: candidate.stageUpdatedAt,
  });

  if (candidate.rejection) {
    events.push({
      id: `rejection-${candidate.rejection.id}`,
      kind: "rejected",
      title: "Candidate Rejected",
      description: `${formatEnumLabel(candidate.rejection.category)} · ${candidate.rejection.notes.slice(0, 80)}`,
      timestamp: candidate.rejection.createdAt,
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function findActiveRound(candidate: Candidate) {
  // An active round is any round that doesn't have feedback yet
  // We prioritize rounds that are SCHEDULED or COMPLETED but missing feedback
  return candidate.rounds.find((round) => !round.feedback);
}
