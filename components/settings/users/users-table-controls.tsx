import { Funnel, Search } from "lucide-react";
import type { UserRole } from "@/types/domain";

interface UsersTableControlsProps {
  query: string;
  roleFilter: UserRole | "ALL";
  onQueryChange: (next: string) => void;
  onRoleFilterChange: (next: UserRole | "ALL") => void;
}

export function UsersTableControls({
  query,
  roleFilter,
  onQueryChange,
  onRoleFilterChange,
}: UsersTableControlsProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between bg-white">
      <label className="relative block w-full sm:max-w-[360px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name or email"
          className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12px] font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400"
        />
      </label>

      <div className="flex items-center gap-2">
        <select
          value={roleFilter}
          onChange={(event) => onRoleFilterChange(event.target.value as UserRole | "ALL")}
          className="h-8.5 min-w-[160px] rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-600 outline-none transition-colors focus:border-slate-400"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="HIRING_MANAGER">Hiring Manager</option>
          <option value="INTERVIEWER">Interviewer</option>
        </select>

        <button
          type="button"
          className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          aria-label="Advanced filters"
        >
          <Funnel className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
