"use client";

import { useMemo, useState } from "react";

import type { User, UserRole } from "@/types/domain";

interface UsersManagementClientProps {
  users: User[];
  currentUserId: string;
}

interface EditableUser extends User {
  draftRole: UserRole;
  draftActive: boolean;
  saving: boolean;
  error: string | null;
  success: boolean;
}

function toEditableUser(user: User): EditableUser {
  return {
    ...user,
    draftRole: user.role,
    draftActive: user.isActive,
    saving: false,
    error: null,
    success: false,
  };
}

export function UsersManagementClient({ users, currentUserId }: UsersManagementClientProps) {
  const [rows, setRows] = useState<EditableUser[]>(() => users.map(toEditableUser));

  const totalActive = useMemo(() => rows.filter((row) => row.isActive).length, [rows]);

  const updateRow = (userId: string, updater: (row: EditableUser) => EditableUser): void => {
    setRows((current) => current.map((row) => (row.id === userId ? updater(row) : row)));
  };

  const onRoleChange = (userId: string, role: UserRole): void => {
    updateRow(userId, (row) => ({
      ...row,
      draftRole: role,
      error: null,
      success: false,
    }));
  };

  const onActiveChange = (userId: string, isActive: boolean): void => {
    updateRow(userId, (row) => ({
      ...row,
      draftActive: isActive,
      error: null,
      success: false,
    }));
  };

  const onSave = async (row: EditableUser): Promise<void> => {
    const payload: { role?: UserRole; is_active?: boolean } = {};
    if (row.draftRole !== row.role) {
      payload.role = row.draftRole;
    }
    if (row.draftActive !== row.isActive) {
      payload.is_active = row.draftActive;
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    updateRow(row.id, (currentRow) => ({
      ...currentRow,
      saving: true,
      error: null,
      success: false,
    }));

    try {
      const response = await fetch(`/api/users/${row.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json()) as { error?: string; issues?: Record<string, string>; user?: User };

      if (!response.ok) {
        const issueMessage = responseBody.issues ? Object.values(responseBody.issues)[0] : undefined;
        throw new Error(issueMessage ?? responseBody.error ?? "Failed to update user");
      }

      const updatedUser = responseBody.user;

      if (!updatedUser) {
        throw new Error("Unexpected API response");
      }

      updateRow(row.id, () => ({
        ...toEditableUser(updatedUser),
        success: true,
      }));
    } catch (error) {
      updateRow(row.id, (currentRow) => ({
        ...currentRow,
        saving: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      }));
    }
  };

  return (
    <section className="rounded-xl border border-[color:var(--color-border)] bg-white p-5">
      <h3 className="text-lg font-semibold">User Management</h3>
      <p className="mt-2 text-sm text-[color:var(--color-ink-soft)]">
        Update account role and activation status. At least one active admin must remain in the system.
      </p>
      <p className="mt-1 text-xs text-[color:var(--color-ink-muted)]">Active users: {totalActive}</p>

      <div className="mt-4 overflow-hidden rounded-lg border border-[color:var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[color:var(--color-panel)] text-xs uppercase tracking-wide text-[color:var(--color-ink-muted)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasChanges = row.draftRole !== row.role || row.draftActive !== row.isActive;
              const isSelf = row.id === currentUserId;

              return (
                <tr key={row.id} className="border-t border-[color:var(--color-border)] align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[color:var(--color-ink)]">
                      {row.fullName} {isSelf ? <span className="text-xs text-[color:var(--color-ink-muted)]">(You)</span> : null}
                    </p>
                    <p className="text-xs text-[color:var(--color-ink-muted)]">{row.email}</p>
                    {row.error ? <p className="mt-1 text-xs text-rose-700">{row.error}</p> : null}
                    {row.success ? <p className="mt-1 text-xs text-emerald-700">Saved</p> : null}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={row.draftRole}
                      onChange={(event) => onRoleChange(row.id, event.target.value as UserRole)}
                      disabled={row.saving || isSelf}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="RECRUITER">RECRUITER</option>
                      <option value="INTERVIEWER">INTERVIEWER</option>
                      <option value="HIRING_MANAGER">HIRING_MANAGER</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={row.draftActive}
                        onChange={(event) => onActiveChange(row.id, event.target.checked)}
                        disabled={row.saving || isSelf}
                        className="h-4 w-4 rounded border-[color:var(--color-border)]"
                      />
                      <span>{row.draftActive ? "Active" : "Inactive"}</span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void onSave(row)}
                      disabled={!hasChanges || row.saving}
                      className="rounded-lg bg-[color:var(--color-primary)] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {row.saving ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
