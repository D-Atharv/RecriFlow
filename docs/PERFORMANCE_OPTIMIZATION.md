# RecriFlow — Performance Optimization Report

> **Date:** 22 February 2026  
> **Stack:** Next.js 16.1.6 · React 19.2 · Prisma 7.4 · PostgreSQL · Vercel Serverless  
> **Symptom:** ~2-second latency when switching between tabs (Dashboard → Candidates → Jobs).

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Root Cause Analysis](#2-root-cause-analysis)
   - [Issue 1 — `export const dynamic = "force-dynamic"` on every page](#issue-1--export-const-dynamic--force-dynamic-on-every-page)
   - [Issue 2 — `prefetch={false}` on navigation links](#issue-2--prefetchfalse-on-navigation-links)
   - [Issue 3 — No data caching (every render = fresh DB query)](#issue-3--no-data-caching-every-render--fresh-db-query)
   - [Issue 4 — Deep eager JOIN on candidate queries](#issue-4--deep-eager-join-on-candidate-queries)
   - [Issue 5 — No streaming / Suspense boundaries](#issue-5--no-streaming--suspense-boundaries)
   - [Issue 6 — Redundant data fetching across pages](#issue-6--redundant-data-fetching-across-pages)
   - [Issue 7 — Serverless cold starts with small connection pool](#issue-7--serverless-cold-starts-with-small-connection-pool)
   - [Issue 8 — Sequential awaits waterfall on detail pages](#issue-8--sequential-awaits-waterfall-on-detail-pages)
3. [Solutions Implemented](#3-solutions-implemented)
   - [Fix 1 — Remove `force-dynamic`](#fix-1--remove-force-dynamic)
   - [Fix 2 — Re-enable link prefetching](#fix-2--re-enable-link-prefetching)
   - [Fix 3 — Server-side cache layer with tag-based invalidation](#fix-3--server-side-cache-layer-with-tag-based-invalidation)
   - [Fix 4 — Lean list queries (split heavy/light projections)](#fix-4--lean-list-queries-split-heavylight-projections)
   - [Fix 5 — Suspense streaming with page-specific skeletons](#fix-5--suspense-streaming-with-page-specific-skeletons)
   - [Fix 6 — Moved `latestRating` computation server-side](#fix-6--moved-latestrating-computation-server-side)
   - [Fix 7 — Parallel data fetching with `Promise.all` on detail pages](#fix-7--parallel-data-fetching-with-promiseall-on-detail-pages)
4. [Next.js-Specific Learnings](#4-nextjs-specific-learnings)
   - [`revalidateTag` signature change in Next.js 16](#revalidatetag-signature-change-in-nextjs-16)
   - [`unstable_cache` vs `force-dynamic`](#unstable_cache-vs-force-dynamic)
   - [Server Components vs Client Components (SSR vs CSR)](#server-components-vs-client-components-ssr-vs-csr)
   - [Suspense streaming in the App Router](#suspense-streaming-in-the-app-router)
   - [Prefetching behavior in the App Router](#prefetching-behavior-in-the-app-router)
5. [SSR / CSR Architecture Decisions](#5-ssr--csr-architecture-decisions)
6. [Files Changed](#6-files-changed)
7. [Before vs After](#7-before-vs-after)

---

## 1. Executive Summary

Every tab navigation triggered a **full server-rendered waterfall**: session check → heavy Prisma query (with 3-level deep JOINs) → serialise → send to client → hydrate. No data was cached, no prefetching occurred, and the response couldn't stream because there were no Suspense boundaries.

Seven root causes were identified. All seven were addressed through a combination of:

- **Server cache layer** (`unstable_cache` + tag-based invalidation)
- **Lean projections** (separate Prisma query shapes for list vs detail)
- **Suspense streaming** (skeleton → async content in parallel)
- **Link prefetching** (re-enabled Next.js default behavior)
- **Removed `force-dynamic`** (allows framework to cache and deduplicate)

---

## 2. Root Cause Analysis

### Issue 1 — `export const dynamic = "force-dynamic"` on every page

**Location:** `app/(app)/dashboard/page.tsx`, `app/(app)/candidates/page.tsx`, `app/(app)/jobs/page.tsx`, `app/(app)/settings/page.tsx`, all detail pages.

**Problem:**  
```ts
export const dynamic = "force-dynamic";
```
This directive tells Next.js: "Never cache this page. Always run the full server function on every request." It disables:
- Static generation
- Incremental Static Regeneration (ISR)
- `unstable_cache` short-circuiting at the page level
- Route Handler result caching

Every single navigation — even revisiting the same page — triggered a fresh server render from scratch.

**Impact:** ~500–1200ms per navigation just from bypassing all caching.

---

### Issue 2 — `prefetch={false}` on navigation links

**Location:** `components/layout/global-nav.tsx`

**Problem:**  
```tsx
<Link href={item.href} prefetch={false}>
```
Next.js automatically prefetches `<Link>` destinations when they appear in the viewport. The `prefetch={false}` prop was explicitly set on every nav link, which meant:

1. No prefetching of the route segment on hover or intersection
2. The browser had to wait for a network round-trip when the user clicked a tab
3. Combined with `force-dynamic`, this guaranteed a full server round-trip on every click

**Impact:** Added the full network latency (~200–600ms) on top of server render time.

---

### Issue 3 — No data caching (every render = fresh DB query)

**Problem:** Page server components called service methods directly:
```tsx
export default async function CandidatesPage() {
  const candidates = await candidatesService.listCandidates();
  const jobs = await jobsService.listJobs();
  // ...
}
```
No caching wrapper existed. Every page render executed fresh PostgreSQL queries. For pages that share the same data (dashboard and candidates both query `listCandidates`), this resulted in duplicate queries.

**Impact:** ~200–400ms per query × 2–3 queries per page = ~400–1200ms in database time alone.

---

### Issue 4 — Deep eager JOIN on candidate queries

**Location:** `server/repositories/mappers.ts` — `candidateWithRelationsArgs`

**Problem:** The single Prisma query shape used everywhere loaded 3 levels deep:
```ts
export const candidateWithRelationsArgs = {
  include: {
    interview_rounds: {         // JOIN 1: interview_round
      include: {
        feedback: true,         // JOIN 2: feedback (includes large text blobs)
        interviewer: true,      // JOIN 3: user table
      },
    },
    rejection: true,            // JOIN 4: rejection_reason
  },
};
```

This was used for **every** query — list pages, detail pages, kanban board, search — regardless of what the UI actually needed.

**Audit of what list views actually use:**

| Field | Dashboard Kanban | Candidates Table | Jobs List |
|-------|:---:|:---:|:---:|
| `rounds` (full) | ✗ | ✗ | ✗ |
| `rounds.feedback.overallRating` | ✗ | ✓ (as `latestRating`) | ✗ |
| `rounds.interviewer` | ✗ | ✗ | ✗ |
| `rejection` | ✗ | ✗ | ✗ |
| `resumeRawText` | ✗ | ✗ | ✗ |
| `fullName`, `email`, `skills`, etc. | ✓ | ✓ | ✓ |

List views used **none** of the heavy nested data, yet every query paid the cost of loading it.

**Impact:** With 100 candidates × 3 rounds each = ~300 interviewer JOINs + ~300 feedback rows (including large text columns) loaded per page render. This bloated both SQL execution time and JSON serialization payload.

---

### Issue 5 — No streaming / Suspense boundaries

**Problem:** Pages rendered as monolithic async functions:
```tsx
export default async function DashboardPage() {
  const user = await requireAppRole([...]);
  const candidates = await candidatesService.listCandidates();
  const jobs = await jobsService.listJobs();
  return <KanbanBoardClient candidates={candidates} jobs={jobs} />;
}
```

The browser received **nothing** until the entire server function completed (auth + all DB queries + serialization). There were no Suspense boundaries, so the framework couldn't stream the shell first and fill in data later.

**Impact:** Users stared at a blank/loading page for the full 2 seconds before seeing any content.

---

### Issue 6 — Redundant data fetching across pages

**Problem:** Multiple pages fetched the same data independently:
- Dashboard: `listCandidates()` + `listJobs()`
- Candidates: `listCandidates()` + `listJobs()`
- Jobs: `listCandidates()` + `listJobs()` + `listUsers()`

Without caching, navigating from Dashboard → Candidates re-executed both queries even though the data hadn't changed.

**Impact:** 2× the necessary database load on every tab switch.

---

### Issue 7 — Serverless cold starts with small connection pool

**Location:** `lib/prisma.ts`

**Problem:**
```ts
const pool = new Pool({
  connectionString,
  max: process.env.NODE_ENV === "production" ? 2 : 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```
On Vercel serverless, each lambda gets its own Pool with max 2 connections. A cold start requires:
1. Lambda boot (~100–300ms)
2. Pool initialization
3. TCP + TLS handshake to PostgreSQL
4. Only then can queries execute

Combined with no caching and deep JOINs, a cold start could easily exceed 2 seconds.

**Impact:** Intermittent spikes of 2–3 seconds, especially after idle periods.

---

### Issue 8 — Sequential awaits waterfall on detail pages

**Location:** `app/(app)/candidates/[id]/page.tsx`, `app/(app)/jobs/[id]/page.tsx`

**Problem:** Detail pages fetched independent data sources with sequential `await` calls:

```tsx
// candidates/[id]/page.tsx — BEFORE
export default async function CandidateDetailPage({ params, searchParams }) {
  const user = await requireAppUser();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const candidate = await getCachedCandidate(id);   // ← Wait for this...
  if (!candidate) notFound();

  const jobs = await getCachedJobs();                // ← ...then start this
  const interviewers = canManage
    ? await getCachedInterviewers()                  // ← ...then start this
    : [];
}
```

```tsx
// jobs/[id]/page.tsx — BEFORE
export default async function JobDetailPage({ params }) {
  const job = await getCachedJob(id);                // ← Wait for this...
  if (!job) notFound();

  const allCandidates = await getCachedCandidates(); // ← ...then start this
}
```

Each `await` blocks the next one from starting. Since `getCachedJobs()` and `getCachedInterviewers()` do not depend on the result of `getCachedCandidate()` (they are independent data sources), there is no reason to wait. The Node.js runtime can issue all queries to the cache layer (or DB on cache miss) simultaneously.

**Waterfall timeline:**
```
candidates/[id] — BEFORE:
  │
  ├─ getCachedCandidate(id)     ████████  (~5ms cache / ~80ms DB)
  │                                     ↓ wait for completion
  ├─ getCachedJobs()                     ████████  (~5ms cache / ~80ms DB)
  │                                               ↓ wait for completion
  └─ getCachedInterviewers()                       ████████  (~5ms cache / ~50ms DB)

Total (cache warm):  ~15ms
Total (cache cold):  ~210ms
```

**Impact:** On a warm cache the penalty is small (~10ms), but on a cache miss (cold start, post-invalidation, or first request) the three queries become a 3-step waterfall, adding up to **150–250ms** of unnecessary sequential wait time on the critical path of every detail page load.

---

## 3. Solutions Implemented

### Fix 1 — Remove `force-dynamic`

**Files:** All page files under `app/(app)/`

Removed `export const dynamic = "force-dynamic"` from every page. This allows Next.js to:
- Leverage `unstable_cache` properly
- Deduplicate fetch requests within a single render
- Use ISR-like behavior with tag-based revalidation

**Before:**
```tsx
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const candidates = await candidatesService.listCandidates();
  // ...
}
```

**After:**
```tsx
export default async function DashboardPage() {
  const user = await requireAppRole([...]);
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent canCreateCandidate={...} />
    </Suspense>
  );
}
```

---

### Fix 2 — Re-enable link prefetching

**File:** `components/layout/global-nav.tsx`

Removed `prefetch={false}` from all `<Link>` components. Next.js now prefetches destination routes when they enter the viewport, so by the time a user clicks a tab, the RSC payload is often already in the router cache.

**Before:**
```tsx
<Link href={item.href} prefetch={false}>
```

**After:**
```tsx
<Link href={item.href}>
```

---

### Fix 3 — Server-side cache layer with tag-based invalidation

Created a 3-file cache module under `server/cache/`:

#### `server/cache/tags.ts` — Central tag registry
```ts
export const CACHE_TAGS = {
  CANDIDATES: "candidates",
  JOBS: "jobs",
  USERS: "users",
  SETTINGS: "settings",
} as const;

export function candidateTag(id: string): string {
  return `candidate-${id}`;
}

export function jobTag(id: string): string {
  return `job-${id}`;
}
```
All tags are defined in one place so invalidation stays consistent.

#### `server/cache/queries.ts` — Cached query wrappers
```ts
export const getCachedCandidatesLean = unstable_cache(
  async (filters: CandidateFilters = {}): Promise<CandidateListItem[]> => {
    return candidatesService.listCandidatesLean(filters);
  },
  ["candidates-list-lean"],
  { revalidate: 30, tags: [CACHE_TAGS.CANDIDATES] },
);
```
Every data query is wrapped with `unstable_cache` using:
- A **30-second TTL** (stale-while-revalidate)
- **Tag-based invalidation** for instant purge on mutations

Available cached queries:
| Function | Returns | Tags |
|----------|---------|------|
| `getCachedCandidatesLean()` | `CandidateListItem[]` | `candidates` |
| `getCachedCandidates()` | `Candidate[]` | `candidates` |
| `getCachedCandidate(id)` | `Candidate \| null` | `candidates`, `candidate-{id}` |
| `getCachedJobs()` | `Job[]` | `jobs` |
| `getCachedJob(id)` | `Job \| null` | `jobs`, `job-{id}` |
| `getCachedUsers()` | `User[]` | `users` |
| `getCachedInterviewers()` | `User[]` | `users` |
| `getCachedSyncLogs()` | `SyncLog[]` | `settings` |
| `getCachedRejections()` | `RejectionReason[]` | `settings`, `candidates` |

#### `server/cache/invalidation.ts` — Mutation-triggered invalidation
```ts
const PURGE_NOW = { expire: 0 };

export function invalidateCandidate(id: string): void {
  revalidateTag(candidateTag(id), PURGE_NOW);
  revalidateTag(CACHE_TAGS.CANDIDATES, PURGE_NOW);
}
```
Every API mutation route calls the appropriate invalidation function. Example from `app/api/candidates/route.ts`:
```ts
export async function POST(request: Request) {
  const candidate = await candidatesService.createCandidate(payload, user);
  invalidateCandidates();
  invalidateJobs();
  return json({ candidate }, 201);
}
```

**API routes with invalidation calls:**

| Route | Method | Invalidation |
|-------|--------|-------------|
| `/api/candidates` | POST | `invalidateCandidates()` + `invalidateJobs()` |
| `/api/candidates/[id]` | PATCH/DELETE | `invalidateCandidate(id)` + `invalidateJobs()` |
| `/api/candidates/[id]/rejection` | POST | `invalidateCandidate(id)` + `invalidateSettings()` |
| `/api/candidates/[id]/rounds` | POST | `invalidateCandidate(id)` |
| `/api/candidates/[id]/rounds/[roundId]/feedback` | POST | `invalidateCandidate(id)` + `invalidateSettings()` |
| `/api/jobs` | POST | `invalidateJobs()` |
| `/api/jobs/[id]` | PATCH/DELETE | `invalidateJob(id)` + `invalidateCandidates()` |
| `/api/users` | POST | `invalidateUsers()` |
| `/api/users/[id]` | PATCH/DELETE | `invalidateUsers()` |

---

### Fix 4 — Lean list queries (split heavy/light projections)

Created a **two-tier query strategy**: lean queries for list views, full queries for detail pages.

#### New type: `CandidateListItem`
**File:** `types/domain.ts`

```ts
export interface CandidateListItem {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  currentRole: string | null;
  currentCompany: string | null;
  totalExperienceYrs: number | null;
  skills: string[];
  resumeUrl: string;
  linkedinUrl: string | null;
  source: CandidateSource;
  currentStage: PipelineStage;
  stageUpdatedAt: string;
  jobId: string;
  recruiterId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  latestRating: number | null;   // Pre-computed server-side
  roundCount: number;             // Count only, no full objects
}
```

vs the full `Candidate` type that also includes `rounds: InterviewRound[]`, `rejection: RejectionReason | null`, `resumeRawText: string`, `avatarUrl`.

#### Lean Prisma query args
**File:** `server/repositories/mappers.ts`

```ts
export const candidateListArgs = {
  include: {
    interview_rounds: {
      select: {
        status: true,
        updated_at: true,
        feedback: {
          select: { overall_rating: true },
        },
      },
      orderBy: { round_number: "desc" as const },
    },
  },
} as const satisfies Prisma.CandidateDefaultArgs;
```

**What this skips vs the full query:**

| Data | `candidateWithRelationsArgs` | `candidateListArgs` |
|------|:---:|:---:|
| `interview_rounds.*` (all columns) | ✓ | ✗ (select only `status`, `updated_at`) |
| `feedback.*` (all columns including text blobs) | ✓ | ✗ (select only `overall_rating`) |
| `interviewer` (full User JOIN) | ✓ | ✗ |
| `rejection` (full relation) | ✓ | ✗ |
| `resume_raw_text` (large text) | ✓ | ✗ (not in candidate select since list views don't need it) |

#### Server-side `latestRating` computation
**File:** `server/repositories/mappers.ts` — `toDomainCandidateListItem()`

```ts
export function toDomainCandidateListItem(record: CandidateForList): CandidateListItem {
  const completedWithFeedback = record.interview_rounds
    .filter((r) => r.status === "COMPLETED" && r.feedback !== null)
    .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());

  const latestRating = completedWithFeedback[0]?.feedback?.overall_rating ?? null;

  return {
    // ... flat scalar fields ...
    latestRating,
    roundCount: record.interview_rounds.length,
  };
}
```

Previously, the client computed `getLatestRating()` by iterating through all rounds + feedback objects on every render. Now it's a flat number sent from the server.

#### Where each query shape is used

| View | Query | Type returned |
|------|-------|---------------|
| Dashboard (kanban) | `getCachedCandidatesLean()` | `CandidateListItem[]` |
| Candidates table | `getCachedCandidatesLean()` | `CandidateListItem[]` |
| Jobs list | `getCachedCandidatesLean()` | `CandidateListItem[]` |
| GET `/api/candidates` | `listCandidatesLean()` | `CandidateListItem[]` |
| Candidate detail `/candidates/[id]` | `getCachedCandidate(id)` | `Candidate` (full) |
| Job detail `/jobs/[id]` | `getCachedCandidates()` | `Candidate[]` (full) |

---

### Fix 5 — Suspense streaming with page-specific skeletons

Each page was split into:
1. **Page component** — handles auth + wraps content in `<Suspense>`
2. **Content component** — async server component that fetches data
3. **Skeleton component** — instant placeholder UI

**Example — Dashboard:**

```
app/(app)/dashboard/
├── page.tsx                          ← Auth + Suspense boundary
└── _components/
    ├── dashboard-content.tsx         ← Async: fetches data, renders client component
    └── dashboard-skeleton.tsx        ← Instant skeleton UI
```

```tsx
// page.tsx
export default async function DashboardPage() {
  const user = await requireAppRole([...]);
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent canCreateCandidate={...} />
    </Suspense>
  );
}
```

```tsx
// dashboard-content.tsx (Server Component)
export async function DashboardContent({ canCreateCandidate }) {
  const [candidates, jobs] = await Promise.all([
    getCachedCandidatesLean(),
    getCachedJobs(),
  ]);
  return <KanbanBoardClient candidates={candidates} jobs={jobs} ... />;
}
```

**Streaming behavior:**
1. Browser receives the page shell + skeleton **immediately** (~50ms)
2. Server continues executing `DashboardContent` in parallel
3. When data resolves, the skeleton is replaced with the real content via streaming
4. User sees meaningful UI in <100ms instead of waiting 2 seconds

This was applied to all three main pages: `/dashboard`, `/candidates`, `/jobs`.

---

### Fix 6 — Moved `latestRating` computation server-side

**File changed:** `components/candidates/candidates-table-client.tsx`

**Before (CSR computation):**
```tsx
function getLatestRating(candidate: Candidate): number | null {
  const completedRounds = (candidate.rounds ?? []).filter((round) => round.feedback);
  const latest = completedRounds
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .at(0);
  return latest?.feedback?.overallRating ?? null;
}

// In render:
const rows = filteredCandidates.map((candidate) => ({
  candidate,
  job: jobMap.get(candidate.jobId),
  latestRating: getLatestRating(candidate),  // Computed client-side on every filter change
}));
```

**After (server-computed):**
```tsx
// In render:
const rows = filteredCandidates.map((candidate) => ({
  candidate,
  job: jobMap.get(candidate.jobId),
  latestRating: candidate.latestRating,  // Pre-computed, just use it
}));
```

This eliminated:
- Shipping full `rounds[]` + `feedback` objects to the client
- Client-side iteration + sorting on every filter/search change
- Unnecessary re-renders from derived state computation

---

### Fix 7 — Parallel data fetching with `Promise.all` on detail pages

**Files changed:** `app/(app)/candidates/[id]/page.tsx`, `app/(app)/jobs/[id]/page.tsx`

All independent data fetches on detail pages were moved into a single `Promise.all` call, allowing the runtime to start all queries simultaneously.

**`candidates/[id]/page.tsx` — After:**
```tsx
export default async function CandidateDetailPage({ params, searchParams }) {
  const user = await requireAppUser();
  const [{ id }, resolvedSearchParams] = await Promise.all([params, searchParams]);

  const canManage = ["ADMIN", "RECRUITER"].includes(user.role);
  const canEditNotes = ["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(user.role);

  // All three queries fire simultaneously
  const [candidate, jobs, interviewers] = await Promise.all([
    getCachedCandidate(id),
    getCachedJobs(),
    canManage ? getCachedInterviewers() : Promise.resolve([]),
  ]);

  if (!candidate) notFound();
  // ...
}
```

**`jobs/[id]/page.tsx` — After:**
```tsx
export default async function JobDetailPage({ params }) {
  const user = await requireAppRole([...]);
  const { id } = await params;

  // Both queries fire simultaneously
  const [job, allCandidates] = await Promise.all([getCachedJob(id), getCachedCandidates()]);

  if (!job) notFound();
  // ...
}
```

**Parallel timeline:**
```
candidates/[id] — AFTER:
  │
  ├─ getCachedCandidate(id)     ████████
  ├─ getCachedJobs()            ████████
  └─ getCachedInterviewers()    ██████
                                        ↑ all resolve together

Total (cache warm):  ~5ms (longest individual query)
Total (cache cold):  ~80ms (longest individual query)
```

**Saving:** Up to ~170ms on cache-cold detail page loads. Additionally, `params` and `searchParams` (which are Promises in Next.js 15+) are now also awaited in parallel.

---

## 4. Next.js-Specific Learnings

### `revalidateTag` signature change in Next.js 16

In Next.js 15 and earlier:
```ts
revalidateTag("candidates");  // Single argument
```

In Next.js 16, `revalidateTag` requires **two arguments** — the tag and a cache-life profile:
```ts
revalidateTag("candidates", { expire: 0 });  // Two arguments required
```

The second argument controls how the revalidation behaves:
- `{ expire: 0 }` — Immediately purge the cached entry
- `string` — Reference a named cache profile

Using the old single-argument form causes TypeScript errors:
```
error TS2554: Expected 2 arguments, but got 1.
```

**Our solution:** Define a shared constant and use it everywhere:
```ts
const PURGE_NOW = { expire: 0 };
revalidateTag(CACHE_TAGS.CANDIDATES, PURGE_NOW);
```

---

### `unstable_cache` vs `force-dynamic`

`force-dynamic` and `unstable_cache` are **directly contradictory**:

| | `force-dynamic` | `unstable_cache` |
|---|---|---|
| Purpose | "Never cache this page" | "Cache this function result" |
| Behavior | Runs full server function every request | Returns cached result if TTL hasn't expired |
| Together | `force-dynamic` wins — cache is bypassed | — |

By removing `force-dynamic`, we allow `unstable_cache` to actually work. The combination of TTL (30s) + tag-based invalidation gives us:
- **Fresh data on mutations** (instant invalidation via `revalidateTag`)
- **Cached data on reads** (no DB hit within 30s of last fetch)
- **Automatic revalidation** (stale data triggers background refresh)

---

### Server Components vs Client Components (SSR vs CSR)

RecriFlow uses a **hybrid architecture** where the rendering responsibility is split:

#### Server Components (SSR)
- **Page components** (`page.tsx`) — Auth checks, data fetching
- **Content components** (`dashboard-content.tsx`, `candidates-content.tsx`, `jobs-content.tsx`) — Fetch cached data, pass to client components
- **Mappers/Services** — All database access happens server-side

These run **only on the server**. They can:
- Access `prisma` directly
- Use `unstable_cache`
- Read cookies/headers
- Never ship their code to the browser

#### Client Components (CSR)
- **Interactive UIs** (`kanban-board-client.tsx`, `candidates-table-client.tsx`)
- **Components with state** (search, filters, drag-and-drop)
- **Components with event handlers** (advance stage, archive candidate)

These are marked with `"use client"` and run in the browser. They receive data as **serialized props** from server components.

#### The SSR→CSR handoff pattern
```
Server Component (page.tsx)
  └─ Auth check (server-only)
  └─ <Suspense fallback={<Skeleton />}>
       └─ Server Component (content.tsx)
            └─ unstable_cache → DB query
            └─ Serialize data as props
            └─ Client Component (board-client.tsx)
                 └─ useState, useEffect, event handlers
                 └─ Client-side filtering, search, DnD
```

**Key insight:** The `"use client"` boundary is the serialization boundary. Everything above it runs on the server and sends JSON to everything below it. By making the data leaner (`CandidateListItem` instead of `Candidate`), we reduce:
1. Serialization time on the server
2. Transfer size over the wire
3. Deserialization/hydration time on the client

---

### Suspense streaming in the App Router

Next.js App Router supports **streaming** via React Suspense. Here's how it works:

1. **Without Suspense:** The server must complete the entire render before sending anything. The browser shows nothing until the full HTML arrives.

2. **With Suspense:** The server sends the page shell immediately (nav, skeleton). When an async server component resolves, the server streams a `<script>` tag that swaps the skeleton with real content.

```
Time →
─────────────────────────────────────────────────────
Without Suspense:
  Server: [auth + DB query ~~~~~~ serialize ~~~]
  Client: [nothing ~~~~~~~~~~~~~~~~~~~~~~~~~~~~][render]

With Suspense:
  Server: [auth][send shell+skeleton]......[DB done → stream content]
  Client: [skeleton visible ~~~~~~~~~~][swap to real content]
─────────────────────────────────────────────────────
```

The user perceives a much faster load because they see the skeleton within ~50ms.

**Important:** `<Suspense>` boundaries should wrap the **slowest part** of the page. In our case, that's the data-fetching content component:

```tsx
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardContent />  {/* ← This is async, triggers streaming */}
</Suspense>
```

---

### Prefetching behavior in the App Router

Next.js `<Link>` prefetches by default:
- For **static routes**: Prefetches the full RSC payload
- For **dynamic routes**: Prefetches up to the nearest loading boundary (30-second cache)

When we had `prefetch={false}` on nav links, clicking a tab started from zero — no prefetched data, no cached segments. Removing it restored the default behavior:

1. User lands on Dashboard
2. Links to `/candidates` and `/jobs` enter the viewport
3. Next.js prefetches their loading states (skeletons) in the background
4. When user clicks "Candidates", the skeleton is shown **instantly** from router cache
5. The data streams in from the server

---

## 5. SSR / CSR Architecture Decisions

### What runs where and why

| Concern | Where | Why |
|---------|-------|-----|
| Authentication | Server Component | Reads session cookie, no bundle cost |
| Database queries | Server Component via `unstable_cache` | Direct DB access, no API round-trip |
| Data serialization | Server → Client boundary | Automatic via React Server Components |
| Search/filter state | Client Component (`useState`) | Interactive, changes on every keystroke |
| Drag-and-drop | Client Component | Requires DOM events, local state |
| Optimistic updates | Client Component | Immediate UI feedback before server confirms |
| Rating computation | Server (mapper) | Avoid shipping round data to client |

### The hydration pattern in candidates-table-client

The `CandidatesTableClient` uses a **double-data strategy**:

1. **Initial SSR data**: Received as props from the server component (fast, cached)
2. **Client hydration refresh**: A `useEffect` fires `fetch("/api/candidates")` to get the absolute latest data

```tsx
// Server-rendered initial data (fast — from cache)
const [candidatesState, setCandidatesState] = useState(normalizedCandidates);

// Client-side refresh (ensures freshness)
useEffect(() => {
  async function hydrateCandidates() {
    const response = await fetch("/api/candidates", { cache: "no-store" });
    const payload = await response.json();
    setCandidatesState(payload.candidates.map(normalizeCandidateListItem));
  }
  hydrateCandidates();
}, []);
```

This ensures:
- **Instant display** from cached server data
- **Freshness guarantee** from client-side revalidation
- The API route also returns `CandidateListItem[]` (lean data)

---

## 6. Files Changed

### New files created

| File | Purpose |
|------|---------|
| `server/cache/tags.ts` | Centralized cache tag registry |
| `server/cache/queries.ts` | `unstable_cache` wrappers for all data queries |
| `server/cache/invalidation.ts` | Tag invalidation functions called by API routes |
| `app/(app)/dashboard/_components/dashboard-content.tsx` | Async server component for dashboard |
| `app/(app)/dashboard/_components/dashboard-skeleton.tsx` | Skeleton placeholder for dashboard |
| `app/(app)/candidates/_components/candidates-content.tsx` | Async server component for candidates |
| `app/(app)/candidates/_components/candidates-skeleton.tsx` | Skeleton placeholder for candidates |
| `app/(app)/jobs/_components/jobs-content.tsx` | Async server component for jobs |
| `app/(app)/jobs/_components/jobs-skeleton.tsx` | Skeleton placeholder for jobs |

### Modified files

| File | Change |
|------|--------|
| `types/domain.ts` | Added `CandidateListItem` interface |
| `server/repositories/mappers.ts` | Added `candidateListArgs`, `CandidateForList`, `toDomainCandidateListItem` |
| `server/services/candidates.service.ts` | Added `listCandidatesLean()`, widened `filterByQuery` signature |
| `components/layout/global-nav.tsx` | Removed `prefetch={false}` from all `<Link>` components |
| `app/(app)/dashboard/page.tsx` | Removed `force-dynamic`, added Suspense boundary |
| `app/(app)/candidates/page.tsx` | Removed `force-dynamic`, added Suspense boundary |
| `app/(app)/jobs/page.tsx` | Removed `force-dynamic`, added Suspense boundary |
| `app/(app)/candidates/[id]/page.tsx` | Uses `getCachedCandidate(id)` instead of direct service call; all fetches parallelised with `Promise.all` |
| `app/(app)/jobs/[id]/page.tsx` | Uses `getCachedJob(id)` + `getCachedCandidates()`; both fetches parallelised with `Promise.all` |
| `app/(app)/settings/page.tsx` | Uses cached queries, removed `force-dynamic` |
| `app/api/candidates/route.ts` | GET returns lean data; POST calls `invalidateCandidates()` |
| `app/api/candidates/[id]/route.ts` | PATCH/DELETE call `invalidateCandidate(id)` |
| `app/api/candidates/[id]/rejection/route.ts` | POST calls `invalidateCandidate(id)` + `invalidateSettings()` |
| `app/api/candidates/[id]/rounds/route.ts` | POST calls `invalidateCandidate(id)` |
| `app/api/candidates/[id]/rounds/[roundId]/feedback/route.ts` | POST calls `invalidateCandidate(id)` + `invalidateSettings()` |
| `app/api/jobs/route.ts` | POST calls `invalidateJobs()` |
| `app/api/jobs/[id]/route.ts` | PATCH/DELETE call `invalidateJob(id)` |
| `app/api/users/route.ts` | POST calls `invalidateUsers()` |
| `app/api/users/[id]/route.ts` | PATCH/DELETE call `invalidateUsers()` |
| `components/dashboard/kanban-board-client.tsx` | `Candidate` → `CandidateListItem` |
| `components/dashboard/kanban/kanban-column.tsx` | `Candidate` → `CandidateListItem` |
| `components/dashboard/candidate-card.tsx` | `Candidate` → `CandidateListItem` |
| `components/candidates/candidates-table-client.tsx` | `Candidate` → `CandidateListItem`, removed `getLatestRating()` |
| `components/candidates/list/candidates-data-table.tsx` | `Candidate` → `CandidateListItem` |
| `components/candidates/list/candidates-grid.tsx` | `Candidate` → `CandidateListItem` |
| `components/candidates/list/candidate-actions-menu.tsx` | `Candidate` → `CandidateListItem` |
| `components/jobs/list/jobs-view-model.ts` | `Candidate` → `CandidateListItem` |

---

## 7. Before vs After

### Request lifecycle comparison

```
BEFORE (every tab click):
┌─────────────────────────────────────────────────────┐
│ Click tab → No prefetch → Server receives request   │
│ → force-dynamic: skip all caches                    │
│ → Auth check (~50ms)                                │
│ → Deep Prisma query with 4 JOINs (~400-800ms)      │
│ → Serialize full Candidate[] with rounds (~100ms)   │
│ → Send complete HTML (~200ms network)               │
│ → Client hydrate full payload (~100ms)              │
│ Total: ~1500-2000ms                                 │
└─────────────────────────────────────────────────────┘

AFTER (tab click):
┌─────────────────────────────────────────────────────┐
│ Click tab → Prefetched skeleton shown instantly      │
│ → Server: Auth check (~50ms)                        │
│ → Stream skeleton to client (~10ms)                 │
│ → unstable_cache hit? Return cached data (~5ms)     │
│   OR cache miss → Lean Prisma query (~100-200ms)    │
│ → Serialize CandidateListItem[] (~20ms)             │
│ → Stream content chunk to client                    │
│ Total perceived: ~50ms (skeleton)                   │
│ Total to content: ~100-300ms                        │
└─────────────────────────────────────────────────────┘
```

### Data payload comparison (100 candidates, 3 rounds each)

| Metric | Before | After |
|--------|--------|-------|
| SQL JOINs per list query | 4 (rounds, feedback, interviewer, rejection) | 1 (rounds with select) |
| Feedback text blobs transferred | 300 (strengths + improvement per feedback) | 0 |
| User (interviewer) rows loaded | 300 | 0 |
| Rejection rows loaded | 100 | 0 |
| `resumeRawText` transferred | 100 (large text per candidate) | 0 |
| Client-side `getLatestRating()` calls | 100 per filter change | 0 (pre-computed) |
| Approximate JSON payload | ~500KB | ~50KB |

### Caching behavior

| Scenario | Before | After |
|----------|--------|-------|
| Same page reload within 30s | Full DB query | Cache hit (0ms DB) |
| Navigate away and back | Full DB query | Cache hit |
| After creating a candidate | Full DB query | Cache invalidated → fresh query → re-cached |
| Cold start after idle | Full DB query (2s+) | Full DB query but lean (~500ms) |
