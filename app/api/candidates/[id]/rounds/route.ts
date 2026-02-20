import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
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
    const rounds = await candidatesService.listRounds(id);

    return json({ rounds });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  try {
    const actor = await requireApiUser(["ADMIN", "RECRUITER"]);
    const { id } = await context.params;
    const payload = await request.json();

    const round = await candidatesService.createRound(id, payload, actor);

    return json({ round }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
