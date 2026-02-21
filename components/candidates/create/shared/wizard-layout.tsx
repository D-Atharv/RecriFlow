"use client";

import type { ReactNode } from "react";

interface WizardLayoutProps {
    sidebar: ReactNode;
    content: ReactNode;
    aside?: ReactNode;
    tip?: ReactNode;
}

export function WizardLayout({ sidebar, content, aside, tip }: WizardLayoutProps) {
    return (
        <div className="flex min-h-[calc(100vh-64px)] w-full">
            {/* Left Sidebar Column */}
            <div className="w-[280px] shrink-0 border-r border-slate-100 bg-slate-50/50">
                <div className="flex flex-col gap-12 sticky top-24 p-8">
                    {sidebar}
                    {tip && <div className="hidden xl:block">{tip}</div>}
                </div>
            </div>

            {/* Main Content Area */}
            <div
                className={[
                    "flex-1 grid grid-cols-1 items-start gap-8 p-10",
                    aside ? "lg:grid-cols-[1fr_360px]" : "grid-cols-1",
                ].join(" ")}
            >
                <main className="flex flex-col gap-6 mx-auto w-full max-w-4xl">
                    {content}
                </main>

                {aside && (
                    <aside className="xl:sticky xl:top-24">
                        {aside}
                    </aside>
                )}

                {tip && <div className="block xl:hidden mt-8">{tip}</div>}
            </div>
        </div>
    );
}
