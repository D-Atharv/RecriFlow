import { handleRouteError, json } from "@/lib/http";
import { syncCandidateToSheets } from "@/lib/sheets";
import { requireApiUser } from "@/server/auth/guards";

interface RouteContext {
  params: Promise<{
    candidateId: string;
  }>;
}

export async function POST(_: Request, context: RouteContext): Promise<Response> {
  try {
    await requireApiUser(["ADMIN", "RECRUITER"]);
    const { candidateId } = await context.params;

    await syncCandidateToSheets(candidateId);

    return json({ success: true, candidate_id: candidateId });
  } catch (error) {
    return handleRouteError(error);
  }
}
