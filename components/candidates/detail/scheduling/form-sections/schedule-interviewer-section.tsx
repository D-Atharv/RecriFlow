"use client";

import { CalendarDays, ChevronDown, UserRound } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { User } from "@/types/domain";

interface ScheduleInterviewerSectionProps {
    register: UseFormRegister<any>;
    interviewers: User[];
    errors: FieldErrors<any>;
}

export function ScheduleInterviewerSection({ register, interviewers, errors }: ScheduleInterviewerSectionProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Interviewer
                </label>
                <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <select
                        {...register("interviewer_id")}
                        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-50/50"
                    >
                        <option value="">Select interviewer...</option>
                        {interviewers.map((iv) => (
                            <option key={iv.id} value={iv.id}>
                                {iv.fullName}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                {errors.interviewer_id ? (
                    <p className="px-1 text-[10px] font-bold uppercase tracking-tight text-rose-600">
                        {errors.interviewer_id.message as string}
                    </p>
                ) : null}
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Date & Time
                </label>
                <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                        type="datetime-local"
                        {...register("scheduled_at")}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-50/50"
                    />
                </div>
                {errors.scheduled_at ? (
                    <p className="px-1 text-[10px] font-bold uppercase tracking-tight text-rose-600">
                        {errors.scheduled_at.message as string}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
