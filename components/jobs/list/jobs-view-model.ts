import { PIPELINE_STAGES, type Candidate, type Job, type PipelineStage, type User } from "@/types/domain";
import type { JobListItem, JobsOverviewMetrics } from "@/components/jobs/list/types";

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((token) => token.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function toRelativePostedLabel(isoDate: string): string {
  const now = Date.now();
  const created = new Date(isoDate).getTime();
  const days = Math.max(Math.floor((now - created) / (1000 * 60 * 60 * 24)), 0);

  if (days === 0) {
    return "Just now";
  }

  if (days === 1) {
    return "1 day ago";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks === 1) {
    return "1 week ago";
  }

  if (weeks < 5) {
    return `${weeks} weeks ago`;
  }

  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

function emptyStageCounts(): Record<PipelineStage, number> {
  return PIPELINE_STAGES.reduce<Record<PipelineStage, number>>((acc, stage) => {
    acc[stage] = 0;
    return acc;
  }, {} as Record<PipelineStage, number>);
}

export function buildJobListItems(params: {
  jobs: Job[];
  candidates: Candidate[];
  users: User[];
}): JobListItem[] {
  const usersById = new Map(params.users.map((user) => [user.id, user]));

  return params.jobs.map((job) => {
    const assigned = params.candidates.filter((candidate) => candidate.jobId === job.id);
    const activeCandidates = assigned.filter(
      (candidate) => !["HIRED", "REJECTED", "WITHDRAWN"].includes(candidate.currentStage),
    ).length;
    const hiredCandidates = assigned.filter((candidate) => candidate.currentStage === "HIRED").length;

    const stageCounts = emptyStageCounts();
    for (const candidate of assigned) {
      stageCounts[candidate.currentStage] += 1;
    }

    const recentCandidateInitials = assigned
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((candidate) => getInitials(candidate.fullName));

    return {
      id: job.id,
      job,
      managerName: usersById.get(job.createdById)?.fullName ?? "Unassigned",
      postedLabel: toRelativePostedLabel(job.createdAt),
      activeCandidates,
      totalCandidates: assigned.length,
      hiredCandidates,
      stageCounts,
      recentCandidateInitials,
    };
  });
}

export function buildJobsOverviewMetrics(items: JobListItem[]): JobsOverviewMetrics {
  const totalOpenings = items.length;
  const activePipeline = items.reduce((acc, item) => acc + item.activeCandidates, 0);

  const jobsAtRisk = items.filter((item) => {
    if (item.job.status !== "OPEN") {
      return false;
    }

    return item.activeCandidates < 2;
  }).length;

  const closedJobs = items.filter((item) => item.job.status === "CLOSED").length;

  return {
    totalOpenings,
    activePipeline,
    jobsAtRisk,
    closedJobs,
  };
}
