import { redirect } from "next/navigation";

import { getDefaultAppRoute } from "@/lib/app-route";
import { getSessionUser } from "@/server/auth/session";

export default async function AuthRedirectPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  redirect(getDefaultAppRoute(user.role));
}
