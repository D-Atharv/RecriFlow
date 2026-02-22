import "server-only";

/**
 * Centralised cache-tag registry.
 *
 * Every tag used by `unstable_cache` and `revalidateTag` MUST be defined here
 * so invalidation stays consistent across the codebase.
 */

export const CACHE_TAGS = {
  /** All candidate list / detail queries */
  CANDIDATES: "candidates",
  /** All job list / detail queries */
  JOBS: "jobs",
  /** All user list queries */
  USERS: "users",
  /** Settings / sync-log / rejection queries */
  SETTINGS: "settings",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Per-entity tag so a single candidate can be surgically invalidated. */
export function candidateTag(id: string): string {
  return `candidate-${id}`;
}

/** Per-entity tag for a single job. */
export function jobTag(id: string): string {
  return `job-${id}`;
}
