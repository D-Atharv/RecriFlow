import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/constants";

const APP_PATH_PREFIXES = ["/dashboard", "/candidates", "/jobs", "/settings"];
const AUTH_PATHS = ["/login", "/register"];

function pathStartsWith(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (pathStartsWith(pathname, APP_PATH_PREFIXES) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathStartsWith(pathname, AUTH_PATHS) && hasSession) {
    return NextResponse.redirect(new URL("/auth/redirect", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/candidates/:path*", "/jobs/:path*", "/settings/:path*", "/login", "/register"],
};
