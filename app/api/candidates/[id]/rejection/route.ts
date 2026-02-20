import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";
import type { RejectCandidateInput } from "@/types/domain";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  try {
    const actor = await requireApiUser(["ADMIN", "RECRUITER"]);
    const { id } = await context.params;
    const payload = (await request.json()) as RejectCandidateInput;

    const candidate = await candidatesService.rejectCandidate(id, payload, actor);

    return json({ candidate });
  } catch (error) {
    return handleRouteError(error);
  }
}
