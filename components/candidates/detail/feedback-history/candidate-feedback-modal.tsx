"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { SessionUser } from "@/types/auth";
import type { Candidate, InterviewPlanStep } from "@/types/domain";
import { CandidateFeedbackViewManager } from "./candidate-feedback-view-manager";

interface CandidateFeedbackModalProps {
    open: boolean;
    onClose: () => void;
    candidate: Candidate;
    viewer: SessionUser;
    interviewPlan: InterviewPlanStep[];
}

export function CandidateFeedbackModal({ open, onClose, candidate, viewer, interviewPlan }: CandidateFeedbackModalProps) {
    const router = useRouter();
    if (!open) return null;

    const handleSuccess = () => {
        onClose();
        router.refresh();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 bg-slate-50/50">
                    <div className="flex flex-col">
                        <h3 className="text-[16px] font-bold tracking-tight text-slate-800 uppercase">Interview Pipeline Feedback</h3>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">Consolidated scorecards and evaluator notes for {candidate.fullName}.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/20">
                    <CandidateFeedbackViewManager
                        candidate={candidate}
                        viewer={viewer}
                        interviewPlan={interviewPlan}
                        onSuccess={handleSuccess}
                    />
                </div>

                <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-600 hover:bg-slate-50 uppercase tracking-wider transition-colors shadow-sm"
                    >
                        Close History
                    </button>
                </div>
            </div>
        </div>
    );
}
