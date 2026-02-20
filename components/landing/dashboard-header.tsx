import React from "react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 bg-background-light/80 glass-panel border-b border-border-light px-8 py-4 flex justify-between items-center bg-glass">
      <div>
        <h1 className="text-2xl font-semibold text-text-main-light tracking-tight">
          Overview
        </h1>
        <p className="text-sm text-text-muted-light mt-0.5">
          Welcome back, here&apos;s what&apos;s happening today.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons-outlined text-gray-400 text-[20px]">
              search
            </span>
          </span>
          <input
            className="pl-10 pr-4 py-2 w-64 border border-border-light rounded-lg bg-surface-light text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
            placeholder="Search candidates..."
            type="text"
          />
        </div>
        <button className="flex items-center gap-2 bg-primary hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-gray-200 transition-all transform active:scale-95">
          <span className="material-icons-outlined text-[18px]">add</span>
          New Candidate
        </button>
        <button className="p-2 text-text-muted-light hover:bg-gray-100 rounded-lg">
          <span className="material-icons-outlined">notifications_none</span>
        </button>
      </div>
    </header>
  );
}
