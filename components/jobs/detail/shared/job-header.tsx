"use client";

import Link from "next/link";
import { ChevronRight, Edit2, Share2 } from "lucide-react";
import { JobStatusPill } from "@/components/jobs/list/job-status-pill";
import type { Job } from "@/types/domain";
import { formatDate } from "@/lib/dates";

interface JobHeaderProps {
    job: Job;
    canManage: boolean;
    activeTab: "overview" | "pipeline" | "candidates";
    onTabChange: (tab: "overview" | "pipeline" | "candidates") => void;
    candidateCount: number;
}

export function JobHeader({ job, canManage, activeTab, onTabChange, candidateCount }: JobHeaderProps) {
    return (
        <div className="flex flex-col gap-3">
            {/* Breadcrumbs & Actions Row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <nav className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Link href="/jobs" className="hover:text-slate-600 transition-colors">Jobs</Link>
                    <ChevronRight className="h-2.5 w-2.5 opacity-50" />
                    <span className="text-slate-900 line-clamp-1">{job.title}</span>
                </nav>

                <div className="flex items-center gap-2">
                    {canManage ? (
                        <Link
                            href={`/jobs/${job.id}/edit`}
                            className="inline-flex h-7.5 items-center gap-1.5 rounded border border-slate-200 bg-white px-3 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest"
                        >
                            <Edit2 className="h-3 w-3" />
                            Edit
                        </Link>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => void navigator.clipboard.writeText(window.location.href)}
                        className="inline-flex h-7.5 items-center gap-1.5 rounded bg-slate-900 px-3 text-[10px] font-bold text-white hover:bg-slate-800 transition-all uppercase tracking-widest shadow-sm shadow-slate-900/10"
                    >
                        <Share2 className="h-3 w-3" />
                        Share
                    </button>
                </div>
            </div>

            {/* Main Title & Info Row */}
            <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-[18px] font-bold tracking-tight text-slate-900 leading-tight">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-2.5 text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                        <JobStatusPill status={job.status} />
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span>Created {formatDate(job.createdAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-slate-400">{job.department}</span>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-5 border-b border-slate-100/60 mt-0.5">
                    <button
                        onClick={() => onTabChange("overview")}
                        className={[
                            "pb-2 text-[10px] font-bold uppercase tracking-widest relative",
                            activeTab === "overview"
                                ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-slate-900"
                                : "text-slate-400 hover:text-slate-600"
                        ].join(" ")}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => onTabChange("pipeline")}
                        className={[
                            "pb-2 text-[10px] font-bold uppercase tracking-widest relative",
                            activeTab === "pipeline"
                                ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-slate-900"
                                : "text-slate-400 hover:text-slate-600"
                        ].join(" ")}
                    >
                        Health
                    </button>
                    <button
                        onClick={() => onTabChange("candidates")}
                        className={[
                            "pb-2 text-[10px] font-bold uppercase tracking-widest relative flex items-center gap-1.5",
                            activeTab === "candidates"
                                ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-slate-900"
                                : "text-slate-400 hover:text-slate-600"
                        ].join(" ")}
                    >
                        Bench
                        <span className={[
                            "flex h-3.5 min-w-[14px] items-center justify-center rounded bg-slate-100 px-1 text-[8px] font-bold",
                            activeTab === "candidates" ? "text-slate-900 ring-1 ring-slate-200" : "text-slate-400"
                        ].join(" ")}>
                            {candidateCount}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
