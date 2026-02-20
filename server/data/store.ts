import "server-only";

import { seedCandidates, seedJobs, seedSyncLogs, seedUsers } from "@/server/data/seeds";
import type { AuthUserRecord } from "@/types/auth";
import type { Candidate, Job, SyncLog } from "@/types/domain";

interface InMemoryStore {
  candidates: Candidate[];
  jobs: Job[];
  users: AuthUserRecord[];
  syncLogs: SyncLog[];
}

declare global {
  var __talentLensStore: InMemoryStore | undefined;
}

const initialStore: InMemoryStore = {
  candidates: structuredClone(seedCandidates),
  jobs: structuredClone(seedJobs),
  users: structuredClone(seedUsers),
  syncLogs: structuredClone(seedSyncLogs),
};

export const store: InMemoryStore = global.__talentLensStore ?? initialStore;

if (!global.__talentLensStore) {
  global.__talentLensStore = store;
}
