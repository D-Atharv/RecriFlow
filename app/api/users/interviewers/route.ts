import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { usersService } from "@/server/services/users.service";

export async function GET(): Promise<Response> {
  try {
    await requireApiUser(["ADMIN", "RECRUITER"]);
    const users = await usersService.listInterviewers();

    return json({ users });
  } catch (error) {
    return handleRouteError(error);
  }
}
