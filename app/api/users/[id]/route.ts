import { handleRouteError, json } from "@/lib/http";
import { requireApiUser } from "@/server/auth/guards";
import { invalidateUsers } from "@/server/cache/invalidation";
import { usersService } from "@/server/services/users.service";
import type { UpdateUserInput } from "@/types/domain";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  try {
    const actor = await requireApiUser(["ADMIN"]);
    const { id } = await context.params;
    const payload = (await request.json()) as UpdateUserInput;
    const user = await usersService.updateUser(id, payload, actor);

    invalidateUsers();

    return json({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext): Promise<Response> {
  try {
    const actor = await requireApiUser(["ADMIN"]);
    const { id } = await context.params;

    await usersService.deleteUser(id, actor);

    invalidateUsers();

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
