import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  if (user) {
    redirect("/dashboard");
  }

  return children;
}
