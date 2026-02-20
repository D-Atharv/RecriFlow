import React from "react";

export function DashboardInterviews() {
  return (
    <div className="bg-surface-light rounded-xl border border-border-light shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-main-light">
          Upcoming Interviews
        </h3>
        <button className="text-xs font-medium text-primary hover:underline">
          Calendar
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center p-3 rounded-lg border border-border-light bg-gray-50/50">
          <div className="flex-shrink-0 w-12 text-center border-r border-border-light pr-3 mr-3">
            <span className="block text-xs font-bold text-text-muted-light uppercase">
              Oct
            </span>
            <span className="block text-lg font-bold text-text-main-light">
              24
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-main-light">
              System Design w/ Zak
            </h4>
            <p className="text-xs text-text-muted-light">
              10:00 AM - 11:00 AM • Google Meet
            </p>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
            <span className="material-icons-outlined text-[20px]">
              videocam
            </span>
          </button>
        </div>
        <div className="flex items-center p-3 rounded-lg border border-border-light bg-gray-50/50">
          <div className="flex-shrink-0 w-12 text-center border-r border-border-light pr-3 mr-3">
            <span className="block text-xs font-bold text-text-muted-light uppercase">
              Oct
            </span>
            <span className="block text-lg font-bold text-text-main-light">
              24
            </span>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-text-main-light">
              Culture Fit w/ Sarah
            </h4>
            <p className="text-xs text-text-muted-light">
              02:30 PM - 03:00 PM • Zoom
            </p>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
            <span className="material-icons-outlined text-[20px]">
              videocam
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
