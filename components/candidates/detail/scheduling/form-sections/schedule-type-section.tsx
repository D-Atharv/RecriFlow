"use client";

import { ChevronDown } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { ROUND_TYPES, type RoundType } from "@/types/domain";

interface ScheduleTypeSectionProps {
    register: UseFormRegister<any>;
    duration: string;
    onDurationChange: (value: string) => void;
}

const DURATION_OPTIONS = [30, 45, 60] as const;

function toRoundLabel(roundType: RoundType): string {
    return roundType
        .toLowerCase()
        .split("_")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
}

export function ScheduleTypeSection({ register, duration, onDurationChange }: ScheduleTypeSectionProps) {
    return (
        <section className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Interview Type
                </label>
                <div className="relative">
                    <select
                        {...register("round_type")}
                        className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-[13px] font-medium text-slate-900 outline-none transition-all focus:border-slate-500 focus:ring-4 focus:ring-slate-50/50"
                    >
                        {ROUND_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {toRoundLabel(type)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                    Duration
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                    {DURATION_OPTIONS.map((opt) => {
                        const val = String(opt);
                        const active = duration === val;
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onDurationChange(val)}
                                className={[
                                    "h-10 rounded-lg border text-[12px] font-bold transition-all uppercase tracking-tight",
                                    active
                                        ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                                ].join(" ")}
                            >
                                {opt}m
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
