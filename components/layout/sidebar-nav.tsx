"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { UserRole } from "@/types/domain";

interface NavItem {
  href: string;
  label: string;
  roles: readonly UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
  { href: "/candidates", label: "Candidates", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
  { href: "/candidates/new", label: "Add Candidate", roles: ["ADMIN", "RECRUITER"] },
  { href: "/jobs", label: "Jobs", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"] },
  { href: "/jobs/new", label: "Create Job", roles: ["ADMIN", "RECRUITER"] },
  { href: "/settings", label: "Settings", roles: ["ADMIN"] },
];

interface SidebarNavProps {
  role: UserRole;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav className="space-y-1">
      {visibleItems.map((item) => {
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
