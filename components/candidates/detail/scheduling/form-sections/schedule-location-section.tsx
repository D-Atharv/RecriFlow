"use client";

import { Copy, Video } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";

interface ScheduleLocationSectionProps {
    register: UseFormRegister<any>;
    autoGenerateLink: boolean;
    onToggleAutoGenerate: () => void;
    meetingLinkValue: string;
}

export function ScheduleLocationSection({
    register,
    autoGenerateLink,
    onToggleAutoGenerate,
    meetingLinkValue,
}: ScheduleLocationSectionProps) {
    return (
        <section className="space-y-4">
            <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Location / Meeting Link
                    </label>
                    <button
                        type="button"
                        onClick={onToggleAutoGenerate}
                        className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Auto-generate
                        <span className={`relative h-3.5 w-7 rounded-full transition-colors ${autoGenerateLink ? "bg-emerald-500" : "bg-slate-200"}`}>
                            <span
                                className={[
                                    "absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white transition-transform",
                                    autoGenerateLink ? "translate-x-4" : "translate-x-0.5",
                                ].join(" ")}
                            />
                        </span>
                    </button>
                </div>

                <div className="relative">
                    <Video className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        {...register("meeting_link")}
                        placeholder="https://meet.google.com/..."
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-11 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-50/50"
                        value={meetingLinkValue}
                        readOnly={autoGenerateLink}
                    />
                    <button
                        type="button"
                        onClick={async () => {
                            if (meetingLinkValue) await navigator.clipboard.writeText(meetingLinkValue);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                    >
                        <Copy className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Preparation Instructions
                </label>
                <textarea
                    {...register("instructions")}
                    placeholder="Evaluation focus, topics to cover, or prep links..."
                    className="min-h-[80px] w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-slate-500 focus:ring-4 focus:ring-slate-50/50"
                />
            </div>
        </section>
    );
}
