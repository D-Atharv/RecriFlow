import { handleRouteError, json } from "@/lib/http";
import { persistSession } from "@/server/auth/session";
import { authService } from "@/server/services/auth.service";

export async function POST(request: Request): Promise<Response> {
  try {
    const payload = await request.json();
    const user = await authService.login(payload);
    await persistSession(user);

    return json({ user });
  } catch (error) {
    return handleRouteError(error);
  }
}
