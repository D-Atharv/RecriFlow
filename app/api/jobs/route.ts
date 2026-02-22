import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { invalidateJobs } from "@/server/cache/invalidation";
import { getCachedJobs } from "@/server/cache/queries";
import { jobsService } from "@/server/services/jobs.service";

export async function GET(): Promise<Response> {
  try {
    await requireApiUser();
    const jobs = await getCachedJobs();

    return json({ jobs });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await requireApiUser(["ADMIN", "RECRUITER"]);
    const payload = await request.json();
    const job = await jobsService.createJob(payload, user.id);

    invalidateJobs();

    return json({ job }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
