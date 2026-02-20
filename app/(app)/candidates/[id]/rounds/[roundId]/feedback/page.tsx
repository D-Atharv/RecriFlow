import { notFound, redirect } from "next/navigation";

import { FeedbackForm } from "@/components/feedback/feedback-form";
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
    <div className="mx-auto max-w-4xl">
      <FeedbackForm
        candidateId={candidate.id}
        roundId={round.id}
        roundType={round.roundType}
        candidateName={candidate.fullName}
      />
    </div>
  );
}
