import { notFound, redirect } from "next/navigation";

import { FeedbackForm } from "@/components/feedback/feedback-form";
import { formatEnumLabel } from "@/components/candidates/detail/candidate-detail.utils";
import { requireAppUser } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";

interface FeedbackPageProps {
  params: Promise<{
    id: string;
    roundId: string;
  }>;
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const user = await requireAppUser();
  const { id, roundId } = await params;

  const candidate = await candidatesService.getCandidateById(id);
  if (!candidate) {
    notFound();
  }

  const round = candidate.rounds.find((item) => item.id === roundId);
  if (!round) {
    notFound();
  }

  if (round.feedback) {
    redirect(`/candidates/${candidate.id}`);
  }

  const canSubmitFeedback = user.role === "ADMIN" || user.id === round.interviewerId;
  if (!canSubmitFeedback) {
    redirect(`/candidates/${candidate.id}`);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-3">
      <header className="space-y-1">
        <p className="text-[11px] font-medium text-slate-500">
          Candidates <span className="mx-1">›</span> {candidate.fullName} <span className="mx-1">›</span> Round {round.roundNumber}: {formatEnumLabel(round.roundType)}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Interview Feedback</h1>
        <p className="text-xs text-slate-500">Provide your assessment for this round.</p>
      </header>

      <FeedbackForm
        candidateId={candidate.id}
        roundId={round.id}
        roundType={round.roundType}
        candidateName={candidate.fullName}
      />
    </div>
  );
}
