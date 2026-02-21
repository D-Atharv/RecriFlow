import { deriveMatchScore, getCandidateInitials } from "@/components/candidates/detail/candidate-detail.utils";
import { CandidateStageRail } from "@/components/candidates/detail/candidate-stage-rail";
import { CandidateHeaderInfo } from "./candidate-header-info";
import { CandidateHeaderActions } from "./candidate-header-actions";
import { MatchScoreCard } from "./match-score-card";
import type { Candidate, User, InterviewPlanStep } from "@/types/domain";
import type { SessionUser } from "@/types/auth";

interface CandidateProfileHeaderProps {
  candidate: Candidate;
  appliedRole: string;
  department: string;
  canManage: boolean;
  interviewers: User[];
  viewer: SessionUser;
  interviewPlan: InterviewPlanStep[];
}

export function CandidateProfileHeader({
  candidate,
  appliedRole,
  department,
  canManage,
  interviewers,
  viewer,
  interviewPlan,
}: CandidateProfileHeaderProps) {
  const matchScore = deriveMatchScore(candidate);

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
      <div className="p-2.5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-2.5">
            <div className="relative group">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-50 via-white to-slate-100 text-[12px] font-bold text-slate-800 ring-1 ring-slate-100 shadow-inner">
                {candidate.avatarUrl ? (
                  <img src={candidate.avatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  getCandidateInitials(candidate.fullName)
                )}
              </div>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
            </div>

            <CandidateHeaderInfo candidate={candidate} appliedRole={appliedRole} department={department} />
          </div>

          <CandidateHeaderActions
            candidate={candidate}
            appliedRole={appliedRole}
            interviewers={interviewers}
            canManage={canManage}
            viewer={viewer}
            interviewPlan={interviewPlan}
          />
        </div>

        <div className="mt-3 flex flex-col items-center gap-3 border-t border-slate-100/60 pt-2.5 xl:flex-row xl:justify-between">
          <div className="w-full xl:max-w-xl">
            <CandidateStageRail currentStage={candidate.currentStage} interviewPlan={interviewPlan} />
          </div>

          <div className="shrink-0">
            <MatchScoreCard score={matchScore} />
          </div>
        </div>
      </div>
    </section>
  );
}
