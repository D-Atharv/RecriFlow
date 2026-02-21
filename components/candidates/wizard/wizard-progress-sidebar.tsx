"use client";

import { Check, Lightbulb } from "lucide-react";

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
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">Upload Progress</p>

      <ol className="mt-5 space-y-4">
        {steps.map((item) => {
          const completed = currentStep > item.step;
          const active = currentStep === item.step;

          return (
            <li key={item.step} className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                  completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-gray-200 bg-gray-100 text-gray-500",
                ].join(" ")}
              >
                {completed ? <Check className="h-4 w-4" /> : item.step}
              </div>

              <div>
                <p className={["text-xl font-semibold tracking-tight", active ? "text-slate-900" : "text-gray-800"].join(" ")}>
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-xl bg-slate-50 p-4">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Lightbulb className="h-4 w-4" />
          ReciFlow Tip
        </p>
        <p className="mt-2 text-xs leading-6 text-slate-800/90">
          Each step adds traceable context to candidate records and keeps sheet sync data complete.
        </p>
      </div>
    </aside>
  );
}
