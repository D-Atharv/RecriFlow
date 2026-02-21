"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Search } from "lucide-react";

export function NotFoundContent() {
    return (
        <div className="flex flex-col items-center gap-5 px-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    404 - Candidate Not Found
                </h1>
                <p className="max-w-[380px] text-[12px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    It looks like this link is no longer in our pipeline. Let's get you back to the search and find that perfect match.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-1">
                <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg bg-slate-900 text-[11px] text-white font-bold transition-all shadow-sm hover:bg-slate-800 transform active:scale-95"
                >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Go to Dashboard</span>
                </Link>
                <Link
                    href="/candidates"
                    className="flex items-center justify-center gap-1.5 h-8 px-4 rounded-lg border border-slate-200 bg-white text-[11px] text-slate-700 font-bold transition-all transform hover:bg-slate-50 active:scale-95 group dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
                >
                    <Users className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
                    <span>View All Candidates</span>
                </Link>
            </div>

            <div className="w-full max-w-xs mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                    Quick Search
                </p>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by name, role, or ID..."
                        className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-slate-200/60 text-[12px] focus:ring-1 focus:ring-primary/10 focus:border-primary/30 transition-all shadow-sm outline-none placeholder:text-slate-400 dark:bg-slate-900 dark:focus:bg-slate-950"
                    />
                </div>
            </div>
        </div>
    );
}
