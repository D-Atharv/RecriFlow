"use client";

import { Lightbulb } from "lucide-react";

interface WizardTipProps {
    label: string;
    content: string;
}

export function WizardTip({ label, content }: WizardTipProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                <Lightbulb className="h-3.5 w-3.5" />
                <span>{label}</span>
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-slate-700">
                {content}
            </p>
        </div>
    );
}
