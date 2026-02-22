import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { invalidateCandidate } from "@/server/cache/invalidation";
import { getCachedCandidate } from "@/server/cache/queries";
import { NotFoundError } from "@/server/errors";
import { candidatesService } from "@/server/services/candidates.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, context: RouteContext): Promise<Response> {
  try {
    await requireApiUser();
    const { id } = await context.params;
    const candidate = await getCachedCandidate(id);
    if (!candidate) throw new NotFoundError("Candidate not found");

    return json({ rounds: candidate.rounds });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  try {
    const actor = await requireApiUser(["ADMIN", "RECRUITER", "INTERVIEWER", "HIRING_MANAGER"]);
    const { id } = await context.params;
    const payload = await request.json();

    const round = await candidatesService.createRound(id, payload, actor);

    invalidateCandidate(id);

    return json({ round }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
