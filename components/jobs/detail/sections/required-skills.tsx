"use client";

import { Star } from "lucide-react";
import type { Job } from "@/types/domain";

interface RequiredSkillsProps {
    job: Job;
}

export function RequiredSkills({ job }: RequiredSkillsProps) {
    const requiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];

    return (
        <article className="rounded-xl border border-slate-200/60 bg-white p-2.5 shadow-sm">
            <div className="flex items-center gap-2 mb-2.5 px-0.5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Required Skills</h3>
            </div>

            <div className="flex flex-wrap gap-1 px-0.5">
                {requiredSkills.map((skill) => (
                    <span
                        key={skill}
                        className="inline-flex h-5 items-center justify-center rounded border border-slate-100 bg-slate-50/50 px-1.5 text-[9px] font-bold text-slate-500 transition-all cursor-default hover:bg-slate-100 uppercase tracking-tight"
                    >
                        {skill}
                    </span>
                ))}
                {requiredSkills.length === 0 ? (
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No skills added.</span>
                ) : null}
            </div>
        </article>
    );
}
