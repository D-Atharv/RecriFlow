import { handleRouteError, json } from "@/lib/http";
import { isValidPipelineStage } from "@/lib/pipeline";
import { requireApiUser } from "@/server/auth/guards";
import { ValidationError } from "@/server/errors";
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
    const candidate = await candidatesService.getCandidateByIdOrThrow(id);

    return json({ candidate });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  try {
    const user = await requireApiUser(["ADMIN", "RECRUITER"]);
    const { id } = await context.params;
    const payload = (await request.json()) as { stage?: string };

    if (!payload.stage || !isValidPipelineStage(payload.stage)) {
      throw new ValidationError("Candidate validation failed", {
        stage: "A valid pipeline stage is required.",
      });
    }

    const candidate = await candidatesService.updateCandidateStage(id, payload.stage, user);

    return json({ candidate });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext): Promise<Response> {
  try {
    const user = await requireApiUser(["ADMIN", "RECRUITER"]);
    const { id } = await context.params;

    await candidatesService.deleteCandidate(id, user);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
