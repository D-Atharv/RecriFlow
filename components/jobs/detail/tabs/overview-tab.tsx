"use client";

import { AboutRole } from "@/components/jobs/detail/sections/about-role";
import { InterviewFlow } from "@/components/jobs/detail/sections/interview-flow";
import { JobBlueprint } from "@/components/jobs/detail/sections/job-blueprint";
import { RequiredSkills } from "@/components/jobs/detail/sections/required-skills";
import type { Job } from "@/types/domain";

interface OverviewTabProps {
    job: Job;
}

export function OverviewTab({ job }: OverviewTabProps) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] items-start">
            {/* Left Column: Role Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="space-y-4">
                    <AboutRole job={job} />
                    <div className="h-px w-full bg-slate-100" />
                    <InterviewFlow job={job} />
                </div>
            </div>

            {/* Right Column: Sidebar Panels */}
            <div className="flex flex-col gap-5 sticky top-24">
                <JobBlueprint job={job} />
                <div className="px-1"> {/* Minimal padding for skills to align with Blueprint visual weight */}
                    <RequiredSkills job={job} />
                </div>
            </div>
        </div>
    );
}
