import React from "react";

export function DashboardActivity() {
  return (
    <div className="bg-surface-light rounded-xl border border-border-light shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-main-light">Recent Activity</h3>
        <a
          className="text-xs font-medium text-primary hover:underline"
          href="#"
        >
          View All
        </a>
      </div>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="mt-1 bg-slate-50 p-2 rounded-full h-8 w-8 flex items-center justify-center">
            <span className="material-icons-outlined text-slate-900 text-[16px]">
              mail
            </span>
          </div>
          <div>
            <p className="text-sm text-text-main-light">
              <span className="font-semibold">Sarah Chen</span> replied to your
              interview invitation.
            </p>
            <p className="text-xs text-text-muted-light mt-1">2 hours ago</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 bg-green-50 p-2 rounded-full h-8 w-8 flex items-center justify-center">
            <span className="material-icons-outlined text-green-600 text-[16px]">
              check_circle
            </span>
          </div>
          <div>
            <p className="text-sm text-text-main-light">
              Automated screening completed for{" "}
              <span className="font-semibold">David Kim</span>.
            </p>
            <p className="text-xs text-text-muted-light mt-1">5 hours ago</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="mt-1 bg-slate-100 p-2 rounded-full h-8 w-8 flex items-center justify-center">
            <span className="material-icons-outlined text-slate-800 text-[16px]">
              rate_review
            </span>
          </div>
          <div>
            <p className="text-sm text-text-main-light">
              Hiring Manager left feedback on{" "}
              <span className="font-semibold">Zak Lambert</span>.
            </p>
            <p className="text-xs text-text-muted-light mt-1">Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
}
