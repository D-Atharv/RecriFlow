import { clearSession } from "@/server/auth/session";

export async function POST(): Promise<Response> {
  await clearSession();
  return new Response(null, { status: 204 });
}
