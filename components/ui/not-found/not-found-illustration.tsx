"use client";

import { Folder } from "lucide-react";

export function NotFoundIllustration() {
    return (
        <div className="relative flex aspect-square w-full max-w-[320px] items-center justify-center">
            {/* Decorative background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-primary/20 animate-bounce [animation-delay:700ms]" />
                <div className="absolute top-1/3 right-1/4 h-3 w-3 rounded-full bg-primary/10 animate-bounce [animation-delay:1000ms]" />
                <div className="absolute bottom-1/4 left-1/3 h-1.5 w-1.5 rounded-full bg-slate-400/20 animate-bounce [animation-delay:500ms]" />
            </div>

            <div className="relative h-40 w-40">
                {/* Glass Rim */}
                <div className="absolute left-6 top-6 z-20 h-24 w-24 rounded-full border-[6px] border-slate-900 bg-white/40 shadow-xl ring-1 ring-slate-900/10 backdrop-blur-[2px] dark:border-primary dark:bg-white/5" />

                {/* Handle */}
                <div className="absolute left-[90px] top-[90px] z-10 h-20 w-5 origin-top-left -rotate-45 rounded-full bg-slate-900 shadow-lg dark:bg-slate-700" />

                {/* Empty State Folder */}
                <div className="absolute left-[45px] top-[55px] -z-10 flex h-20 w-32 rotate-6 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <Folder className="h-6 w-6 text-slate-200 dark:text-slate-800" />
                </div>

                {/* Floating fragments */}
                <div className="absolute right-0 top-0 rotate-12 rounded-md border border-slate-100 bg-white p-1 shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-800">
                    <div className="mb-0.5 h-1 w-6 rounded bg-slate-100 dark:bg-slate-700" />
                    <div className="h-1 w-3 rounded bg-slate-100 dark:bg-slate-700" />
                </div>

                <div className="absolute bottom-6 left-0 -rotate-6 rounded-md border border-slate-100 bg-white p-1 shadow-sm animate-pulse [animation-delay:150ms] dark:border-slate-800 dark:bg-slate-800">
                    <div className="mb-0.5 h-1 w-5 rounded bg-slate-100 dark:bg-slate-700" />
                    <div className="h-1 w-8 rounded bg-slate-100 dark:bg-slate-700" />
                </div>
            </div>
        </div>
    );
}
