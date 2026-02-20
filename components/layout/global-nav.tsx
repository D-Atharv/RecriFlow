"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import type { SessionUser } from "@/types/auth";
import type { UserRole } from "@/types/domain";

interface NavItem {
    href: string;
    label: string;
    roles: readonly UserRole[];
}

const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
    { href: "/jobs", label: "Jobs", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"] },
    { href: "/candidates", label: "Candidates", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
    { href: "/interviews", label: "Interviews", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER", "INTERVIEWER"] },
    { href: "/reports", label: "Reports", roles: ["ADMIN", "RECRUITER", "HIRING_MANAGER"] },
];

export function GlobalNav({ user }: { user: SessionUser }) {
    const pathname = usePathname();
    const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

    return (
        <header className="h-16 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-20 flex-shrink-0">
            <div className="flex items-center gap-8">
                <Link href="/dashboard" className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined filled">pentagon</span>
                    <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">TalentLens</span>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {visibleItems.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={[
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                    active
                                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                ].join(" ")}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <div className="relative group cursor-pointer flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary font-bold text-xs">
                        {user.fullName.charAt(0)}
                    </div>

                    <div className="absolute top-10 right-0 w-48 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                        <div className="px-2 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
