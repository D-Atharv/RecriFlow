import "server-only";

import { unstable_cache } from "next/cache";

import { candidatesService } from "@/server/services/candidates.service";
import { jobsService } from "@/server/services/jobs.service";
import { usersService } from "@/server/services/users.service";
import { settingsService } from "@/server/services/settings.service";
import { CACHE_TAGS, candidateTag, jobTag } from "@/server/cache/tags";
import type { Candidate, CandidateFilters, CandidateListItem, Job, User } from "@/types/domain";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** How long (in seconds) cached data is considered fresh. */
const DEFAULT_TTL = 30;

// ---------------------------------------------------------------------------
// Candidate queries
// ---------------------------------------------------------------------------

/**
 * Cached list of all candidates (full relations).
 * Invalidated by `revalidateTag(CACHE_TAGS.CANDIDATES)`.
 */
export const getCachedCandidates = unstable_cache(
  async (filters: CandidateFilters = {}): Promise<Candidate[]> => {
    return candidatesService.listCandidates(filters);
  },
  ["candidates-list"],
  { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.CANDIDATES] },
);

/**
 * Lean cached list for list views (dashboard, candidates table, jobs).
 * Skips loading interviewer, feedback text, rejection, and resumeRawText.
 */
export const getCachedCandidatesLean = unstable_cache(
  async (filters: CandidateFilters = {}): Promise<CandidateListItem[]> => {
    return candidatesService.listCandidatesLean(filters);
  },
  ["candidates-list-lean"],
  { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.CANDIDATES] },
);

/**
 * Cached single candidate by id.
 * Invalidated by `revalidateTag(candidateTag(id))` OR the global candidates tag.
 */
export function getCachedCandidate(id: string): Promise<Candidate | null> {
  return unstable_cache(
    async (): Promise<Candidate | null> => {
      return candidatesService.getCandidateById(id);
    },
    [`candidate-${id}`],
    { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.CANDIDATES, candidateTag(id)] },
  )();
}

// ---------------------------------------------------------------------------
// Job queries
// ---------------------------------------------------------------------------

/**
 * Cached list of all jobs.
 * Invalidated by `revalidateTag(CACHE_TAGS.JOBS)`.
 */
export const getCachedJobs = unstable_cache(
  async (): Promise<Job[]> => {
    return jobsService.listJobs();
  },
  ["jobs-list"],
  { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.JOBS] },
);

/**
 * Cached single job by id.
 */
export function getCachedJob(id: string): Promise<Job | null> {
  return unstable_cache(
    async (): Promise<Job | null> => {
      return jobsService.getJobById(id);
    },
    [`job-${id}`],
    { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.JOBS, jobTag(id)] },
  )();
}

// ---------------------------------------------------------------------------
// User queries
// ---------------------------------------------------------------------------

/**
 * Cached list of all users (public projection).
 */
export const getCachedUsers = unstable_cache(
  async (): Promise<User[]> => {
    return usersService.listUsers();
  },
  ["users-list"],
  { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.USERS] },
);

/**
 * Cached list of active interviewers.
 */
export const getCachedInterviewers = unstable_cache(
  async (): Promise<User[]> => {
    return usersService.listInterviewers();
  },
  ["interviewers-list"],
  { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.USERS] },
);

// ---------------------------------------------------------------------------
// Settings queries
// ---------------------------------------------------------------------------

export const getCachedSyncLogs = unstable_cache(
  async () => {
    return settingsService.listSyncLogs();
  },
  ["sync-logs"],
  { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.SETTINGS] },
);

export const getCachedRejections = unstable_cache(
  async () => {
    return settingsService.listRejections();
  },
  ["rejections"],
  { revalidate: DEFAULT_TTL, tags: [CACHE_TAGS.SETTINGS, CACHE_TAGS.CANDIDATES] },
);
