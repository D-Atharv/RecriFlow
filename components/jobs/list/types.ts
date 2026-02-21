import type { Job, JobStatus, PipelineStage } from "@/types/domain";

export interface JobListItem {
  id: string;
  job: Job;
  managerName: string;
  postedLabel: string;
  activeCandidates: number;
  totalCandidates: number;
  hiredCandidates: number;
  stageCounts: Record<PipelineStage, number>;
  recentCandidateInitials: string[];
}

export interface JobsOverviewMetrics {
  totalOpenings: number;
  activePipeline: number;
  jobsAtRisk: number;
  closedJobs: number;
}

export interface JobFiltersState {
  query: string;
  status: JobStatus | "ALL";
  department: string | "ALL";
  managerId: string | "ALL";
  viewMode: "table" | "grid";
}

export interface JobManagerOption {
  id: string;
  name: string;
}

export interface JobDepartmentOption {
  id: string;
  label: string;
}

export interface JobActionsCallbacks {
  onStatusChange: (job: Job, status: JobStatus) => Promise<void>;
}
