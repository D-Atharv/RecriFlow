import { notFound } from "next/navigation";
import { CandidateActivityTimeline } from "@/components/candidates/detail/candidate-activity-timeline";
import { CandidateFeedbackHistory } from "@/components/candidates/detail/feedback-history/candidate-feedback-history";
import { CandidateDetailSectionTabs } from "@/components/candidates/detail/candidate-detail-section-tabs";
import { CandidateInternalNotesCard } from "@/components/candidates/detail/candidate-internal-notes-card";
import { CandidateProfileHeader } from "@/components/candidates/detail/candidate-profile-header";
import { CandidateResumeViewer } from "@/components/candidates/detail/candidate-resume-viewer";
import { CandidateSnapshotCard } from "@/components/candidates/detail/candidate-snapshot-card";
import { CandidateFeedbackViewManager } from "@/components/candidates/detail/feedback-history/candidate-feedback-view-manager";
import { requireAppUser } from "@/server/auth/guards";
import { getCachedCandidate, getCachedJobs, getCachedInterviewers } from "@/server/cache/queries";

interface CandidateDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    view?: string;
  }>;
}

const CANDIDATE_DETAIL_VIEWS = ["overall", "snapshot", "resume", "timeline", "feedback", "notes"] as const;
type CandidateDetailView = (typeof CANDIDATE_DETAIL_VIEWS)[number];

function getCandidateDetailView(value?: string): CandidateDetailView {
  if (!value) {
    return "overall";
  }
  if (CANDIDATE_DETAIL_VIEWS.includes(value as CandidateDetailView)) {
    return value as CandidateDetailView;
  }
  return "overall";
}

export default async function CandidateDetailPage({ params, searchParams }: CandidateDetailPageProps) {
  const user = await requireAppUser();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const candidate = await getCachedCandidate(id);

  if (!candidate) {
    notFound();
  }

  const activeView = getCandidateDetailView(resolvedSearchParams.view);

  const canManage = ["ADMIN", "RECRUITER"].includes(user.role);
  const canEditNotes = ["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(user.role);
  const jobs = await getCachedJobs();
  const interviewers = canManage ? await getCachedInterviewers() : [];
  const job = jobs.find((item) => item.id === candidate.jobId);
  const appliedRole = job?.title ?? candidate.currentRole ?? "Unassigned role";
  const department = job?.department ?? "No department";

  return (
    <div className="space-y-2.5">
      <CandidateDetailSectionTabs candidateId={candidate.id} currentView={activeView} />

      <CandidateProfileHeader
        candidate={candidate}
        appliedRole={appliedRole}
        department={department}
        canManage={canManage}
        interviewers={interviewers}
        viewer={user}
        interviewPlan={job?.interviewPlan ?? []}
      />

      {activeView === "overall" ? (
        <div className="grid gap-3 xl:grid-cols-[1.65fr_1fr]">
          <section className="space-y-3">
            <CandidateResumeViewer candidate={candidate} />
            <CandidateFeedbackViewManager
              candidate={candidate}
              viewer={user}
              interviewPlan={job?.interviewPlan ?? []}
            />
          </section>

          <aside className="space-y-3">
            <CandidateSnapshotCard candidate={candidate} appliedRole={appliedRole} department={department} />
            <section>
              <CandidateInternalNotesCard
                candidateId={candidate.id}
                initialNotes={candidate.notes}
                canEdit={canEditNotes}
              />
            </section>
            <section>
              <CandidateActivityTimeline candidate={candidate} />
            </section>
          </aside>
        </div>
      ) : null}

      {activeView === "snapshot" ? (
        <CandidateSnapshotCard candidate={candidate} appliedRole={appliedRole} department={department} />
      ) : null}

      {activeView === "resume" ? <CandidateResumeViewer candidate={candidate} /> : null}

      {activeView === "timeline" ? <CandidateActivityTimeline candidate={candidate} /> : null}

      {activeView === "notes" ? (
        <section>
          <CandidateInternalNotesCard
            candidateId={candidate.id}
            initialNotes={candidate.notes}
            canEdit={canEditNotes}
          />
        </section>
      ) : null}

      {activeView === "feedback" ? (
        <CandidateFeedbackViewManager
          candidate={candidate}
          viewer={user}
          interviewPlan={job?.interviewPlan ?? []}
        />
      ) : null}
    </div>
  );
}
