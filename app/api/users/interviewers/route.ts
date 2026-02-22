import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { getCachedInterviewers } from "@/server/cache/queries";

export async function GET(): Promise<Response> {
  try {
    await requireApiUser(["ADMIN", "RECRUITER"]);
    const users = await getCachedInterviewers();

    return json({ users });
  } catch (error) {
    return handleRouteError(error);
  }
}
