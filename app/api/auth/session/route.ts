import { json } from "@/lib/http";
import { getSessionUser } from "@/server/auth/session";

export async function GET(): Promise<Response> {
  const user = await getSessionUser();

  return json({ user });
}
