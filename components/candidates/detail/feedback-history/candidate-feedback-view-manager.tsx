"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, History } from "lucide-react";
import type { SessionUser } from "@/types/auth";
import type { Candidate, InterviewPlanStep } from "@/types/domain";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { CandidateFeedbackHistory } from "./candidate-feedback-history";
import { findActiveRound } from "../candidate-detail.utils";

interface CandidateFeedbackViewManagerProps {
    candidate: Candidate;
    viewer: SessionUser;
    interviewPlan: InterviewPlanStep[];
    onSuccess?: () => void;
}

type FeedbackView = "form" | "history";

export function CandidateFeedbackViewManager({ candidate, viewer, interviewPlan, onSuccess }: CandidateFeedbackViewManagerProps) {
    const router = useRouter();
    const plannedRounds = useMemo(() => interviewPlan.filter(step => step.kind === "ROUND"), [interviewPlan]);

    const [view, setView] = useState<FeedbackView>("form");
    const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
    const [initializing, setInitializing] = useState<string | null>(null);

    // Map planned steps to actual round objects
    const items = useMemo(() => {
        // Create a copy to track which rounds have already been "claimed" by a plan step
        const availableRounds = [...candidate.rounds];

        return plannedRounds.map(step => {
            // Find the first round of this type that hasn't been claimed yet
            const roundIndex = availableRounds.findIndex(r => r.roundType === step.roundType);
            let actualRound = null;

            if (roundIndex !== -1) {
                actualRound = availableRounds[roundIndex];
                availableRounds.splice(roundIndex, 1); // Remove it from availability
            }

            return {
                step,
                round: actualRound,
                hasFeedback: !!actualRound?.feedback
            };
        });
    }, [plannedRounds, candidate.rounds]);

    // Track if we should default to a specific round
    useEffect(() => {
        const activeItem = items.find(item => item.round && !item.hasFeedback);
        if (activeItem?.round) {
            setSelectedRoundId(activeItem.round.id);
        }
    }, [items]);

    const handleStartRound = async (roundType: string) => {
        setInitializing(roundType);
        try {
            const response = await fetch(`/api/candidates/${candidate.id}/rounds`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    round_type: roundType,
                    interviewer_id: viewer.id, // Current user is the interviewer by default
                    scheduled_at: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error("Failed to initialize round");

            const data = await response.json();
            const round = data.round;
            setSelectedRoundId(round.id);
            setView("form");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Error initializing round. Please try again.");
        } finally {
            setInitializing(null);
        }
    };

    const selectedRound = useMemo(() =>
        candidate.rounds.find(r => r.id === selectedRoundId),
        [candidate.rounds, selectedRoundId]
    );

    if (view === "form" && selectedRound) {
        return (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                    <button
                        onClick={() => setSelectedRoundId(null)}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 uppercase tracking-tight transition-colors"
                    >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Back to Rounds</span>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
                            {selectedRound.roundType.replace(/_/g, " ")}
                        </span>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-xl border border-slate-100 p-1 shadow-sm overflow-y-auto custom-scrollbar">
                    <FeedbackForm
                        candidateId={candidate.id}
                        roundId={selectedRound.id}
                        roundType={selectedRound.roundType}
                        candidateName={candidate.fullName}
                        onSuccess={() => {
                            setSelectedRoundId(null);
                            setView("history"); // Switch to history view after feedback is done
                            router.refresh(); // Ensure the page data is updated
                            onSuccess?.();
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-1 mb-6 p-1 bg-slate-100/50 rounded-lg w-fit">
                <button
                    onClick={() => setView("form")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${view === "form"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Feedback</span>
                </button>
                <button
                    onClick={() => setView("history")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${view === "history"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                >
                    <History className="h-3.5 w-3.5" />
                    <span>View History</span>
                </button>
            </div>

            <div className="flex-1">
                {view === "form" ? (
                    <div className="grid gap-3">
                        {items.length === 0 ? (
                            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/30">
                                <MessageSquare className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No interview plan defined for this job.</p>
                            </div>
                        ) : (
                            items.map((item, idx) => (
                                <div
                                    key={item.step.key}
                                    className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${item.hasFeedback
                                        ? "bg-emerald-50/20 border-emerald-100/50"
                                        : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-black ${item.hasFeedback
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors"
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">
                                                {item.step.label}
                                            </h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                {item.hasFeedback ? "Feedback Done" : item.round ? "Pending Feedback" : "Round not started"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {item.hasFeedback ? (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                <History className="h-3.5 w-3.5" />
                                            </div>
                                        ) : item.round ? (
                                            <button
                                                onClick={() => setSelectedRoundId(item.round!.id)}
                                                className="h-8 px-4 rounded-lg bg-slate-900 text-[10px] font-bold text-white uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                Give Feedback
                                            </button>
                                        ) : (
                                            <button
                                                disabled={!!initializing}
                                                onClick={() => item.step.roundType && handleStartRound(item.step.roundType)}
                                                className="h-8 px-4 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 uppercase tracking-widest shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {initializing === item.step.roundType ? "Starting..." : "Give Feedback"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <CandidateFeedbackHistory candidate={candidate} viewer={viewer} />
                )}
            </div>
        </div>
    );
}
