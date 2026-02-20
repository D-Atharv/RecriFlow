import Link from "next/link";
import { notFound } from "next/navigation";

import { RejectCandidateForm } from "@/components/candidates/detail/reject-candidate-form";
import { ScheduleRoundForm } from "@/components/candidates/detail/schedule-round-form";
import { formatDate } from "@/lib/dates";
import { STAGE_LABELS } from "@/lib/pipeline";
import { requireAppUser } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";
import { usersService } from "@/server/services/users.service";

interface CandidateDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  const user = await requireAppUser();
  const { id } = await params;
  const candidate = await candidatesService.getCandidateById(id);

  if (!candidate) {
    notFound();
  }

  const canManage = ["ADMIN", "RECRUITER"].includes(user.role);
  const jobs = await jobsService.listJobs();
  const interviewers = canManage ? await usersService.listInterviewers() : [];
  const job = jobs.find((item) => item.id === candidate.jobId);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-[color:var(--color-ink-muted)]">Candidate Profile</p>
            <h2 className="mt-1 text-2xl font-semibold">{candidate.fullName}</h2>
            <p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">{candidate.currentRole ?? "Role not provided"}</p>
          </div>
          <Link
            href="/candidates"
            className="rounded-lg border border-[color:var(--color-border)] px-3 py-2 text-sm text-[color:var(--color-ink-soft)]"
          >
            Back to Candidates
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Email:</span> {candidate.email}
            </p>
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Phone:</span> {candidate.phone ?? "-"}
            </p>
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Company:</span> {candidate.currentCompany ?? "-"}
            </p>
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Experience:</span>{" "}
              {candidate.totalExperienceYrs ?? "-"} years
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Applied Job:</span> {job?.title ?? "Unassigned"}
            </p>
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Current Stage:</span>{" "}
              {STAGE_LABELS[candidate.currentStage]}
            </p>
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Source:</span> {candidate.source}
            </p>
            <p>
              <span className="text-[color:var(--color-ink-muted)]">Resume:</span>{" "}
              <a href={candidate.resumeUrl} className="text-[color:var(--color-primary)] hover:underline" target="_blank" rel="noreferrer">
                Open resume
              </a>
            </p>
          </div>
        </div>

        {candidate.skills.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[color:var(--color-panel)] px-3 py-1 text-xs font-medium text-[color:var(--color-ink-soft)]"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {canManage ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ScheduleRoundForm candidateId={candidate.id} interviewers={interviewers} />
          <RejectCandidateForm candidateId={candidate.id} />
        </div>
      ) : null}

      <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-5">
        <h3 className="text-lg font-semibold">Interview Timeline</h3>
        {candidate.rounds.length === 0 ? (
          <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">No rounds scheduled yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {candidate.rounds.map((round) => {
              const canSubmitFeedback = user.role === "ADMIN" || user.id === round.interviewerId;

              return (
                <div key={round.id} className="rounded-lg border border-[color:var(--color-border)] p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">
                      Round {round.roundNumber} - {round.roundType}
                    </p>
                    <p className="text-[color:var(--color-ink-soft)]">{round.status}</p>
                  </div>
                  <p className="mt-1 text-[color:var(--color-ink-soft)]">
                    Interviewer: {round.interviewerName} | Scheduled: {formatDate(round.scheduledAt)}
                  </p>
                  {round.feedback ? (
                    <p className="mt-2 text-[color:var(--color-ink)]">
                      Overall Rating: {round.feedback.overallRating}/5 | Recommendation: {round.feedback.recommendation}
                    </p>
                  ) : canSubmitFeedback ? (
                    <Link
                      href={`/candidates/${candidate.id}/rounds/${round.id}/feedback`}
                      className="mt-2 inline-block text-[color:var(--color-primary)] hover:underline"
                    >
                      Submit feedback
                    </Link>
                  ) : (
                    <p className="mt-2 text-[color:var(--color-ink-muted)]">Awaiting feedback submission.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
