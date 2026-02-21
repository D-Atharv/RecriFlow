import { MoreVertical } from "lucide-react";

import type { UserRole } from "@/types/domain";
import {
  avatarTone,
  formatRoleLabel,
  initials,
  roleTone,
  statusTone,
  toLastActiveLabel,
} from "@/components/settings/users/users.utils";

export interface EditableUserRow {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  updatedAt: string;
  draftRole: UserRole;
  draftActive: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
}

interface UsersTableProps {
  rows: EditableUserRow[];
  currentUserId: string;
  canManage: boolean;
  onDraftRoleChange: (userId: string, role: UserRole) => void;
  onDraftActiveChange: (userId: string, isActive: boolean) => void;
  onSave: (row: EditableUserRow) => Promise<void>;
  onRemove: (row: EditableUserRow) => Promise<void>;
}

export function UsersTable({
  rows,
  currentUserId,
  canManage,
  onDraftRoleChange,
  onDraftActiveChange,
  onSave,
  onRemove,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left">
        <thead className="border-b border-slate-100 bg-slate-50/50">
          <tr className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <th className="px-5 py-2">User</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Last Active</th>
            <th className="px-4 py-2">2FA</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => {
            const isSelf = row.id === currentUserId;
            const hasChanges = row.draftRole !== row.role || row.draftActive !== row.isActive;

            return (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/30">
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white shadow-sm ${avatarTone(index)}`}>
                      {initials(row.fullName)}
                    </span>
                    <div>
                      <p className="text-[13px] font-bold leading-tight text-slate-800">
                        {row.fullName}
                        {isSelf ? <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">You</span> : null}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">{row.email}</p>
                      {row.error ? <p className="text-[11px] font-medium text-rose-600">{row.error}</p> : null}
                      {row.success ? <p className="text-[11px] font-medium text-emerald-600">Saved</p> : null}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${roleTone(row.draftRole)}`}>
                      {formatRoleLabel(row.draftRole)}
                    </span>
                    <select
                      value={row.draftRole}
                      onChange={(event) => onDraftRoleChange(row.id, event.target.value as UserRole)}
                      disabled={!canManage || row.saving || isSelf}
                      className="h-7 w-full min-w-[110px] rounded border border-slate-100 bg-white px-2 text-[10px] font-bold text-slate-700 outline-none transition-colors focus:border-slate-300 disabled:cursor-not-allowed disabled:bg-slate-50/50"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="RECRUITER">Recruiter</option>
                      <option value="HIRING_MANAGER">Hiring Manager</option>
                      <option value="INTERVIEWER">Interviewer</option>
                    </select>
                  </div>
                </td>

                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusTone(row.draftActive)}`}>
                      {row.draftActive ? "Active" : "Invited"}
                    </span>
                    <input
                      type="checkbox"
                      checked={row.draftActive}
                      onChange={(event) => onDraftActiveChange(row.id, event.target.checked)}
                      disabled={!canManage || row.saving || isSelf}
                      className="h-3.5 w-3.5 rounded border-slate-200 text-slate-900 focus:ring-slate-500 disabled:cursor-not-allowed"
                    />
                  </div>
                </td>

                <td className="px-4 py-2.5 text-[11px] font-medium text-slate-500">
                  {row.draftActive ? toLastActiveLabel(row.updatedAt) : "-"}
                </td>

                <td className="px-4 py-2.5 text-[11px]">
                  <span className="text-slate-400">-</span>
                </td>

                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-end gap-1.5">
                    {!row.draftActive ? (
                      <button type="button" className="text-[11px] font-bold text-slate-900 hover:text-slate-700 underline underline-offset-4 decoration-slate-200">
                        Resend
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void onSave(row)}
                      disabled={!canManage || !hasChanges || row.saving}
                      className="inline-flex h-7 items-center rounded bg-slate-900 px-2.5 text-[10px] font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {row.saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void onRemove(row)}
                      disabled={!canManage || isSelf || row.saving}
                      className="inline-flex h-7 items-center rounded border border-rose-100 bg-white px-2.5 text-[10px] font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                      aria-label={`Open row options for ${row.fullName}`}
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                No users match this filter.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
