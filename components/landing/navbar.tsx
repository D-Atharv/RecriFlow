"use client";

import Link from "next/link";
import { useState } from "react";
import { MegaMenuContent } from "./mega-menu-content";

const NAV_LINKS = ["Product", "Customers", "Company", "Resources"];

export function Navbar() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <nav
            className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <span className="material-icons-outlined text-gray-900">auto_awesome</span>
                        <span className="font-bold text-xl tracking-tight">RecriFlow</span>
                    </div>

                    <div
                        className="hidden md:flex items-center h-full relative"
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        {/* Background pill that slides between items */}
                        <div
                            className="absolute h-9 bg-[#4A4A4A] rounded-full transition-all duration-300 ease-in-out z-0 opacity-0 pointer-events-none"
                            style={{
                                width: '110px',
                                left: hoveredItem ? `${NAV_LINKS.indexOf(hoveredItem) * 128 + 9}px` : '0px',
                                opacity: hoveredItem ? 1 : 0,
                                transform: hoveredItem ? 'scale(1)' : 'scale(0.9)',
                            }}
                        />

                        {NAV_LINKS.map((link) => (
                            <div
                                key={link}
                                className="relative z-10 w-32 flex justify-center items-center h-full cursor-default"
                                onMouseEnter={() => setHoveredItem(link)}
                            >
                                <Link
                                    className={[
                                        "px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full",
                                        hoveredItem === link ? "text-white" : "text-gray-600 hover:text-gray-900"
                                    ].join(" ")}
                                    href="#"
                                >
                                    {link}
                                </Link>
                            </div>
                        ))}

                        {/* Shared Mega Menu Container */}
                        <div
                            className={[
                                "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 transition-all duration-300 ease-out",
                                hoveredItem ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-4"
                            ].join(" ")}
                            onMouseEnter={() => hoveredItem && setHoveredItem(hoveredItem)}
                        >
                            <div className="shadow-2xl rounded-[32px] overflow-hidden">
                                <MegaMenuContent activeMenu={hoveredItem ?? ""} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link className="text-sm font-medium text-gray-900 hover:opacity-70" href="/login">Log in</Link>
                        <Link className="bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-md" href="#">Get demo</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
