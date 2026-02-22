import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { invalidateJob, invalidateCandidates } from "@/server/cache/invalidation";
import { jobsService } from "@/server/services/jobs.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_: Request, context: RouteContext): Promise<Response> {
  try {
    await requireApiUser();
    const { id } = await context.params;
    const job = await jobsService.getJobByIdOrThrow(id);

    return json({ job });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  try {
    await requireApiUser(["ADMIN", "RECRUITER"]);
    const { id } = await context.params;
    const payload = await request.json();
    const job = await jobsService.updateJob(id, payload);

    invalidateJob(id);
    invalidateCandidates();

    return json({ job });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext): Promise<Response> {
  try {
    await requireApiUser(["ADMIN"]);
    const { id } = await context.params;

    await jobsService.deleteJob(id);

    invalidateJob(id);
    invalidateCandidates();

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
