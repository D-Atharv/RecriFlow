"use client";

import { Mail, MoreHorizontal, FileText, MessageSquare } from "lucide-react";

import type { Candidate, User, InterviewPlanStep } from "@/types/domain";
import type { SessionUser } from "@/types/auth";
import { CandidateAdvanceStageButton } from "./candidate-advance-stage-button";
import { RejectCandidateModal } from "./reject-candidate-modal";
import { ScheduleRoundSheet } from "./schedule-round-sheet";
import { CandidateFeedbackModal } from "./feedback-history/candidate-feedback-modal";
import { useState } from "react";

interface CandidateHeaderActionsProps {
    candidate: Candidate;
    appliedRole: string;
    interviewers: User[];
    canManage: boolean;
    viewer: SessionUser;
    interviewPlan: InterviewPlanStep[];
}

export function CandidateHeaderActions({
    candidate,
    appliedRole,
    interviewers,
    canManage,
    viewer,
    interviewPlan,
}: CandidateHeaderActionsProps) {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    return (
        <div className="flex flex-wrap items-center gap-1">
            <div className="flex items-center gap-1 pr-1.5 border-r border-slate-100">
                <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="inline-flex h-7.5 items-center gap-1.5 rounded border border-slate-200 bg-white px-2 text-[10px] font-bold text-emerald-600 transition-all hover:bg-emerald-50/50 uppercase tracking-tight"
                >
                    <MessageSquare className="h-3 w-3" />
                    <span>Feedback</span>
                </button>

                <a
                    href={`mailto:${candidate.email}`}
                    className="inline-flex h-7.5 items-center gap-1.5 rounded border border-slate-200 bg-white px-2 text-[10px] font-bold text-slate-600 transition-all hover:bg-slate-50 uppercase tracking-tight"
                >
                    <Mail className="h-3 w-3" />
                    <span>Email</span>
                </a>

                <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-7.5 items-center gap-1.5 rounded border border-slate-200 bg-white px-2 text-[10px] font-bold text-slate-600 transition-all hover:bg-slate-50 uppercase tracking-tight"
                >
                    <FileText className="h-3 w-3" />
                    <span>Resume</span>
                </a>

                {canManage && (
                    <ScheduleRoundSheet
                        candidateId={candidate.id}
                        candidateName={candidate.fullName}
                        appliedRole={appliedRole}
                        currentStage={candidate.currentStage}
                        interviewers={interviewers}
                    />
                )}

                <button
                    type="button"
                    className="inline-flex h-7.5 w-7.5 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 transition-all hover:bg-slate-50"
                >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
            </div>

            {canManage && (
                <div className="flex items-center gap-1.5 pl-0.5">
                    <RejectCandidateModal
                        candidateId={candidate.id}
                        candidateName={candidate.fullName}
                        appliedRole={appliedRole}
                    />
                    <CandidateAdvanceStageButton
                        candidateId={candidate.id}
                        currentStage={candidate.currentStage}
                    />
                </div>
            )}

            <CandidateFeedbackModal
                open={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                candidate={candidate}
                viewer={viewer}
                interviewPlan={interviewPlan}
            />
        </div>
    );
}
