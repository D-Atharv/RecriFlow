import { revalidatePath } from "next/cache";

import { handleRouteError, json } from "@/lib/http";
import { isValidPipelineStage } from "@/lib/pipeline";
import { requireApiUser } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import type { CandidateFilters } from "@/types/domain";

export async function GET(request: Request): Promise<Response> {
  try {
    await requireApiUser(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);

    const { searchParams } = new URL(request.url);
    const stage = searchParams.get("stage");
    const query = searchParams.get("query") ?? undefined;
    const jobId = searchParams.get("jobId") ?? undefined;

    const filters: CandidateFilters = {
      query,
      jobId,
    };

    if (stage && isValidPipelineStage(stage)) {
      filters.stage = stage;
    }

    const candidates = await candidatesService.listCandidates(filters);
    return json({ candidates });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await requireApiUser(["ADMIN", "RECRUITER"]);
    const payload = await request.json();
    const candidate = await candidatesService.createCandidate(payload, user);

    revalidatePath("/dashboard");
    revalidatePath("/candidates");
    revalidatePath(`/candidates/${candidate.id}`);
    revalidatePath("/jobs");
    revalidatePath(`/jobs/${candidate.jobId}`);

    return json({ candidate }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
