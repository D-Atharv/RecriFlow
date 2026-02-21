"use client";

import { Briefcase, Calendar, MapPin } from "lucide-react";

import { STAGE_LABELS } from "@/lib/pipeline";
import type { Candidate } from "@/types/domain";

interface CandidateHeaderInfoProps {
    candidate: Candidate;
    appliedRole: string;
    department: string;
}

function getStageTone(stage: Candidate["currentStage"]): string {
    switch (stage) {
        case "HIRED":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
        case "REJECTED":
        case "WITHDRAWN":
            return "bg-rose-50 text-rose-600 border-rose-100";
        default:
            return "bg-slate-100 text-slate-900 border-slate-200";
    }
}

export function CandidateHeaderInfo({ candidate, appliedRole, department }: CandidateHeaderInfoProps) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <h1 className="text-[15px] font-bold tracking-tight text-slate-800 leading-tight">{candidate.fullName}</h1>
                <span
                    className={[
                        "inline-flex rounded border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                        getStageTone(candidate.currentStage),
                    ].join(" ")}
                >
                    {STAGE_LABELS[candidate.currentStage]}
                </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] font-bold text-slate-400">
                <span className="inline-flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-slate-300" />
                    {appliedRole}
                </span>
                <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-300" />
                    {candidate.currentCompany ?? "Remote"}
                </span>
                <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-300" />
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(candidate.createdAt))}
                </span>
                <span className="rounded bg-slate-100/80 px-1 py-0.5 text-[8px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200/50">
                    {department}
                </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-0.5">
                {candidate.skills.slice(0, 4).map((skill) => (
                    <span
                        key={skill}
                        className="rounded border border-slate-100 bg-slate-50/30 px-1.5 py-0.5 text-[8px] font-bold text-slate-400 uppercase tracking-wider"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}
