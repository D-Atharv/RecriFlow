import React from "react";

export function DashboardSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-border-light bg-surface-light flex flex-col justify-between transition-colors duration-200">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border-light">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-primary">
              auto_awesome
            </span>
            <span className="font-bold text-lg tracking-tight text-text-main-light">
              RecriFlow
            </span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <a
            className="flex items-center gap-3 px-3 py-2.5 bg-primary text-white rounded-lg group transition-all shadow-md"
            href="#"
          >
            <span className="material-icons-outlined text-[20px]">
              dashboard
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 text-text-muted-light hover:bg-gray-100 rounded-lg group transition-colors"
            href="#"
          >
            <span className="material-icons-outlined text-[20px]">
              people_alt
            </span>
            <span className="text-sm font-medium">Candidates</span>
            <span className="ml-auto bg-gray-200 text-xs px-2 py-0.5 rounded-full text-gray-600">
              12
            </span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 text-text-muted-light hover:bg-gray-100 rounded-lg group transition-colors"
            href="#"
          >
            <span className="material-icons-outlined text-[20px]">
              work_outline
            </span>
            <span className="text-sm font-medium">Jobs</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 text-text-muted-light hover:bg-gray-100 rounded-lg group transition-colors"
            href="#"
          >
            <span className="material-icons-outlined text-[20px]">
              schedule
            </span>
            <span className="text-sm font-medium">Interviews</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-2.5 text-text-muted-light hover:bg-gray-100 rounded-lg group transition-colors"
            href="#"
          >
            <span className="material-icons-outlined text-[20px]">
              analytics
            </span>
            <span className="text-sm font-medium">Analytics</span>
          </a>
        </nav>
      </div>
      <div className="p-4 border-t border-border-light">
        <a
          className="flex items-center gap-3 px-3 py-2.5 text-text-muted-light hover:bg-gray-100 rounded-lg group transition-colors mb-2"
          href="#"
        >
          <span className="material-icons-outlined text-[20px]">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="flex items-center gap-3 px-3 py-3 mt-2 border-t border-border-light pt-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-main-light truncate">
              Jane Doe
            </p>
            <p className="text-xs text-text-muted-light truncate">
              Recruiter Admin
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
