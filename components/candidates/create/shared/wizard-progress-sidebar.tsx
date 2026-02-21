"use client";

import { Check } from "lucide-react";

interface WizardStepItem {
    step: 1 | 2 | 3 | 4;
    label: string;
    description: string;
}

interface WizardProgressSidebarProps {
    steps: readonly WizardStepItem[];
    currentStep: 1 | 2 | 3 | 4;
}

export function WizardProgressSidebar({ steps, currentStep }: WizardProgressSidebarProps) {
    return (
        <nav className="flex flex-col gap-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-primary">Upload Progress</p>

            <ol className="relative flex flex-col gap-6">
                {/* Vertical line connector */}
                <div className="absolute left-[13.5px] top-2 h-[calc(100%-16px)] w-px bg-slate-100" />

                {steps.map((item) => {
                    const isCompleted = currentStep > item.step;
                    const isActive = currentStep === item.step;

                    return (
                        <li key={item.step} className="relative z-10 flex items-start gap-3.5">
                            <div
                                className={[
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-all duration-200",
                                    isCompleted
                                        ? "border-emerald-500 bg-emerald-500 text-white"
                                        : isActive
                                            ? "border-slate-900 bg-slate-900 text-white shadow-[0_0_0_4px_rgba(15,23,42,0.1)]"
                                            : "border-slate-200 bg-white text-slate-400",
                                ].join(" ")}
                            >
                                {isCompleted ? <Check className="h-3.5 w-3.5" /> : item.step}
                            </div>

                            <div className="flex flex-col gap-0.5 pt-0.5">
                                <p
                                    className={[
                                        "text-[14px] font-bold leading-tight transition-colors duration-200",
                                        isActive ? "text-slate-900" : "text-slate-800",
                                        !isActive && !isCompleted && "text-slate-500",
                                    ].join(" ")}
                                >
                                    {item.label}
                                </p>
                                <p className="text-[11px] text-slate-400">{item.description}</p>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
