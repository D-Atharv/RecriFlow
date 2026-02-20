"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/candidates", label: "Candidates" },
  { href: "/candidates/new", label: "Add Candidate" },
  { href: "/jobs", label: "Jobs" },
  { href: "/jobs/new", label: "Create Job" },
  { href: "/settings", label: "Settings" },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "block rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-[color:var(--color-primary)] text-white"
                : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-panel)] hover:text-[color:var(--color-ink)]",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
