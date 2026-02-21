import Link from "next/link";
import { ReactNode } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";

interface MenuSubItem {
    title: string;
    description: string;
    href: string;
}

interface MenuCategory {
    label: string;
    items: MenuSubItem[];
}

const CATEGORIES: Record<string, MenuCategory[] | { left: MenuSubItem[]; right: ReactNode }> = {
    Product: [
        {
            label: "Features",
            items: [
                { title: "Pipeline Management", description: "Track candidates seamlessly", href: "#" },
                { title: "AI Screening", description: "Automated resume parsing", href: "#" },
                { title: "Scheduling", description: "Sync with calendars", href: "#" },
            ],
        },
        {
            label: "Analytics",
            items: [
                { title: "Reporting", description: "Data-driven insights", href: "#" },
                { title: "Diversity Tracking", description: "Equity in hiring", href: "#" },
            ],
        },
    ],
    Customers: {
        left: [
            { title: "Financial technology", description: "Payments, fintech, lending, investing", href: "#" },
            { title: "Banking", description: "Corporate, asset, insurance, wealth", href: "#" },
            { title: "Platforms", description: "Marketplaces, platforms, suppliers", href: "#" },
        ],
        right: (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl bg-[#F0F0EB] p-8">
                <div className="w-full max-w-[200px] rounded-xl bg-white p-3 opacity-60 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">PEP</span>
                    </div>
                    <p className="mt-1 text-[9px] text-gray-400 ml-7">Updated 2 hours ago</p>
                </div>
                <div className="w-full max-w-[220px] rounded-xl bg-white p-4 shadow-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-4 w-4 text-emerald-500 animate-[spin_3s_linear_infinite]" />
                        <span className="text-sm font-semibold text-gray-900">Adverse media</span>
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 ml-7">Updated 2 hours ago</p>
                </div>
                <div className="w-full max-w-[200px] rounded-xl bg-white p-3 opacity-60 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <RefreshCw className="h-4 w-4 text-gray-400" />
                        <span className="text-xs font-medium text-gray-600">Sanctions</span>
                    </div>
                    <p className="mt-1 text-[9px] text-gray-400 ml-7">Updated 2 hours ago</p>
                </div>
            </div>
        ),
    },
    Company: {
        left: [
            { title: "About", description: "Our story", href: "#" },
            { title: "News", description: "Press and insights", href: "#" },
            { title: "Careers", description: "We are hiring", href: "#" },
        ],
        right: (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-2xl bg-[#EBEBE6] p-6">
                <div className="w-full max-w-[200px] rounded-xl bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-800">
                            JD
                        </div>
                        <div className="h-2 w-20 rounded-full bg-gray-100"></div>
                    </div>
                    <div className="mt-3 space-y-2">
                        <div className="h-1.5 w-full rounded-full bg-gray-50"></div>
                        <div className="h-1.5 w-2/3 rounded-full bg-gray-50"></div>
                    </div>
                </div>
                <div className="w-full max-w-[240px] rounded-xl bg-white p-4 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span className="text-sm font-semibold text-gray-900">Resume Parsed</span>
                        </div>
                        <span className="text-[10px] text-gray-400">Just now</span>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-[11px]">
                            <span className="text-gray-400">Experience</span>
                            <span className="font-semibold text-gray-900">5 Years</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="text-gray-400">Skills</span>
                            <span className="font-semibold text-gray-900 text-right">Python, React, AWS</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span className="text-gray-400">Education</span>
                            <span className="font-semibold text-gray-900">M.S. Comp Sci</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
    },
    Resources: [
        {
            label: "Learn",
            items: [
                { title: "Blog", description: "Latest industry news", href: "#" },
                { title: "Guides", description: "Best practices for hiring", href: "#" },
                { title: "Webinars", description: "Watch expert sessions", href: "#" },
            ],
        },
        {
            label: "Support",
            items: [
                { title: "Help Center", description: "FAQs and tutorials", href: "#" },
                { title: "API Docs", description: "Build custom integrations", href: "#" },
            ],
        },
    ],
};

export function MegaMenuContent({ activeMenu }: { activeMenu: string }) {
    const data = CATEGORIES[activeMenu];

    if (!data) return null;

    return (
        <div className="relative flex min-h-[340px] w-[800px] overflow-hidden rounded-[32px] bg-[#4A4A4A] p-8 text-white shadow-2xl transition-all duration-300">
            {Array.isArray(data) ? (
                <div className="flex w-full gap-12">
                    {data.map((category) => (
                        <div key={category.label} className="flex-1">
                            <p className="mb-6 text-[13px] font-medium uppercase tracking-wider text-gray-400">
                                {category.label}
                            </p>
                            <div className="space-y-8">
                                {category.items.map((item) => (
                                    <Link key={item.title} href={item.href} className="group block">
                                        <p className="text-xl font-medium transition-colors group-hover:text-gray-300">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-gray-400">{item.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex w-full gap-8">
                    <div className="flex-1 space-y-8">
                        {data.left.map((item) => (
                            <Link key={item.title} href={item.href} className="group block">
                                <p className="text-xl font-medium transition-colors group-hover:text-gray-300">
                                    {item.title}
                                </p>
                                <p className="text-sm text-gray-400">{item.description}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="flex-1">{data.right}</div>
                </div>
            )}

            {/* Decorative vertical line */}
            <div className="absolute left-1/2 top-8 bottom-8 w-[1px] bg-white/10" />
        </div>
    );
}
