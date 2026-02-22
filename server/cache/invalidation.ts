import "server-only";

import { revalidateTag } from "next/cache";

import { CACHE_TAGS, candidateTag, jobTag } from "@/server/cache/tags";

/**
 * Next.js 16 requires a cache-life profile as the second argument to `revalidateTag`.
 * Using `{ expire: 0 }` ensures the tag is purged immediately.
 */
const PURGE_NOW: { expire: number } = { expire: 0 };

// ---------------------------------------------------------------------------
// Candidate invalidation
// ---------------------------------------------------------------------------

/** Invalidate a single candidate AND the global candidates list cache. */
export function invalidateCandidate(id: string): void {
  revalidateTag(candidateTag(id), PURGE_NOW);
  revalidateTag(CACHE_TAGS.CANDIDATES, PURGE_NOW);
}

/** Invalidate the entire candidates cache (list + all individual entries). */
export function invalidateCandidates(): void {
  revalidateTag(CACHE_TAGS.CANDIDATES, PURGE_NOW);
}

// ---------------------------------------------------------------------------
// Job invalidation
// ---------------------------------------------------------------------------

/** Invalidate a single job AND the global jobs list cache. */
export function invalidateJob(id: string): void {
  revalidateTag(jobTag(id), PURGE_NOW);
  revalidateTag(CACHE_TAGS.JOBS, PURGE_NOW);
}

/** Invalidate the entire jobs cache. */
export function invalidateJobs(): void {
  revalidateTag(CACHE_TAGS.JOBS, PURGE_NOW);
}

// ---------------------------------------------------------------------------
// User invalidation
// ---------------------------------------------------------------------------

/** Invalidate the users cache (list + interviewers). */
export function invalidateUsers(): void {
  revalidateTag(CACHE_TAGS.USERS, PURGE_NOW);
}

// ---------------------------------------------------------------------------
// Settings invalidation
// ---------------------------------------------------------------------------

/** Invalidate settings-related caches (sync logs, rejections). */
export function invalidateSettings(): void {
  revalidateTag(CACHE_TAGS.SETTINGS, PURGE_NOW);
}
