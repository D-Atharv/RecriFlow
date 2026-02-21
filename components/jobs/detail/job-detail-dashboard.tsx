"use client";

import { useState } from "react";
import { JobHeader } from "@/components/jobs/detail/shared/job-header";
import { OverviewTab } from "@/components/jobs/detail/tabs/overview-tab";
import { JobPipelineDistribution } from "./job-pipeline-distribution";
import { JobCandidatesTable } from "./job-candidates-table";
import type { Candidate, Job } from "@/types/domain";

interface JobDetailDashboardProps {
  job: Job;
  candidates: Candidate[];
  canManage: boolean;
}

interface JobDetailDashboardProps {
  job: Job;
  candidates: Candidate[];
  canManage: boolean;
}

export function JobDetailDashboard({ job, candidates, canManage }: JobDetailDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "pipeline" | "candidates">("overview");

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-10 py-6 space-y-6">
      <JobHeader
        job={job}
        canManage={canManage}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        candidateCount={candidates.length}
      />

      <div className="relative">
        {activeTab === "overview" && (
          <div>
            <OverviewTab job={job} />
          </div>
        )}

        {activeTab === "pipeline" && (
          <div>
            <JobPipelineDistribution candidates={candidates} />
          </div>
        )}

        {activeTab === "candidates" && (
          <div>
            <JobCandidatesTable candidates={candidates} />
          </div>
        )}
      </div>
    </div>
  );
}
