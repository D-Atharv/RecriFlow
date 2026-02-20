import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { candidatesService } from "@/server/services/candidates.service";

interface RouteContext {
  params: Promise<{
    id: string;
    roundId: string;
  }>;
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  try {
    const actor = await requireApiUser();
    const { id, roundId } = await context.params;
    const payload = await request.json();

    const feedback = await candidatesService.submitFeedback(id, roundId, payload, actor);

    return json({ success: true, feedback_id: feedback.id }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
