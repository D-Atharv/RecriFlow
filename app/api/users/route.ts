import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { invalidateUsers } from "@/server/cache/invalidation";
import { getCachedUsers } from "@/server/cache/queries";
import { usersService } from "@/server/services/users.service";
import type { CreateUserInput } from "@/types/domain";

export async function GET(): Promise<Response> {
  try {
    await requireApiUser(["ADMIN"]);
    const users = await getCachedUsers();

    return json({ users });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    await requireApiUser(["ADMIN"]);
    const payload = (await request.json()) as CreateUserInput;
    const user = await usersService.createUser(payload);

    invalidateUsers();

    return json({ user }, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
