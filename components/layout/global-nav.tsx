"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Hexagon } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import type { SessionUser } from "@/types/auth";
import type { UserRole } from "@/types/domain";

interface TopNavItem {
  href: string;
  label: string;
  roles: readonly UserRole[];
}

const TOP_NAV_ITEMS: TopNavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
  { href: "/candidates", label: "Candidates", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
  { href: "/jobs", label: "Jobs", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"] },
  { href: "/settings", label: "Settings", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"] },
];

function isNavItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const visibleItems = TOP_NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 text-slate-900 transition-opacity hover:opacity-90"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 shadow-sm shadow-slate-900/15 ring-1 ring-slate-800/80">
              <Hexagon className="h-4 w-4 fill-white text-white" />
            </span>
            <span className="text-xl leading-none font-semibold tracking-tight">RecriFlow</span>
          </Link>

          <span className="hidden h-8 w-px bg-slate-200 md:block" />

          <nav className="hidden items-center gap-1 rounded-xl bg-slate-50/80 p-1 ring-1 ring-slate-200/80 md:flex">
            {visibleItems.map((item) => {
              const active = isNavItemActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/90"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-900",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">

          <div className="group relative">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 py-1 pl-1.5 pr-2 text-slate-700 transition-colors hover:bg-amber-100/70"
              aria-label="Open user menu"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                {user.fullName.charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-[120px] truncate text-[12px] font-semibold sm:block">{user.fullName}</span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 sm:block" />
            </button>

            <div className="invisible absolute right-0 top-12 z-40 w-56 rounded-xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl shadow-slate-900/10 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="border-b border-slate-100 pb-2">
                <p className="truncate text-sm font-semibold text-slate-900">{user.fullName}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
                <p className="mt-1 text-[11px] font-semibold tracking-wide text-slate-400">{user.role}</p>
              </div>
              <div className="mt-2">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
