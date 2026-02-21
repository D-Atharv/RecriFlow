import { revalidatePath } from "next/cache";

import { handleRouteError, json } from "@/lib/http";
import { isValidPipelineStage } from "@/lib/pipeline";
import { requireApiUser } from "@/server/auth/guards";
import { ValidationError } from "@/server/errors";
import { candidatesService } from "@/server/services/candidates.service";
import type { PipelineStage } from "@/types/domain";

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
    const { id } = await context.params;
    const payload = (await request.json()) as { stage?: string; notes?: string | null };
    const hasStage = payload.stage !== undefined;
    const hasNotes = payload.notes !== undefined;

    if (!hasStage && !hasNotes) {
      throw new ValidationError("Candidate validation failed", {
        request: "At least one updatable field is required.",
      });
    }

    if (hasStage && !payload.stage) {
      throw new ValidationError("Candidate validation failed", {
        stage: "A valid pipeline stage is required.",
      });
    }

    if (hasStage && !isValidPipelineStage(payload.stage as string)) {
      throw new ValidationError("Candidate validation failed", {
        stage: "A valid pipeline stage is required.",
      });
    }

    let candidate = null;

    if (hasStage) {
      const user = await requireApiUser(["ADMIN", "RECRUITER"]);
      candidate = await candidatesService.updateCandidateStage(id, payload.stage as PipelineStage, user);
    }

    if (hasNotes) {
      const userForNotes = hasStage ? await requireApiUser(["ADMIN", "RECRUITER"]) : await requireApiUser(["ADMIN", "RECRUITER", "HIRING_MANAGER"]);
      const normalized = typeof payload.notes === "string" ? payload.notes.trim() : "";
      const notes = normalized.length ? normalized.slice(0, 4000) : null;
      candidate = await candidatesService.updateCandidateNotes(id, notes, userForNotes);
    }

    if (candidate) {
      revalidatePath("/dashboard");
      revalidatePath("/candidates");
      revalidatePath(`/candidates/${candidate.id}`);
      revalidatePath("/jobs");
      revalidatePath(`/jobs/${candidate.jobId}`);
    }

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
