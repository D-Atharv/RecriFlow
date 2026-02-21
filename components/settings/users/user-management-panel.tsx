"use client";

import { Download, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AddUserDialog } from "@/components/settings/users/add-user-dialog";
import { RolePermissionsReference } from "@/components/settings/users/role-permissions-reference";
import { UsersTable, type EditableUserRow } from "@/components/settings/users/users-table";
import { UsersTableControls } from "@/components/settings/users/users-table-controls";
import { UserMetricsCards } from "@/components/settings/users/user-metrics-cards";
import type { CreateUserSchemaInput } from "@/types/schemas";
import type { User, UserRole } from "@/types/domain";

interface UserManagementPanelProps {
  users: User[];
  currentUserId: string;
  canManage: boolean;
}

function toEditableUser(user: User): EditableUserRow {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    updatedAt: user.updatedAt,
    draftRole: user.role,
    draftActive: user.isActive,
    saving: false,
    error: null,
    success: false,
  };
}

function toCsv(rows: EditableUserRow[]): string {
  const header = ["Name", "Email", "Role", "Active", "Updated At"];
  const body = rows.map((row) => [row.fullName, row.email, row.role, row.isActive ? "true" : "false", row.updatedAt]);
  return [header, ...body]
    .map((line) => line.map((value) => `"${String(value).replaceAll("\"", '""')}"`).join(","))
    .join("\n");
}

export function UserManagementPanel({ users, currentUserId, canManage }: UserManagementPanelProps) {
  const [rows, setRows] = useState<EditableUserRow[]>(() => users.map(toEditableUser));
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [showAddUser, setShowAddUser] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (roleFilter !== "ALL" && row.draftRole !== roleFilter) {
        return false;
      }

      if (!needle) {
        return true;
      }

      const haystack = [row.fullName, row.email].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, roleFilter, rows]);

  const updateRow = (id: string, updater: (row: EditableUserRow) => EditableUserRow): void => {
    setRows((current) => current.map((row) => (row.id === id ? updater(row) : row)));
  };

  const onDraftRoleChange = (userId: string, role: UserRole): void => {
    updateRow(userId, (row) => ({
      ...row,
      draftRole: role,
      error: null,
      success: false,
    }));
  };

  const onDraftActiveChange = (userId: string, isActive: boolean): void => {
    updateRow(userId, (row) => ({
      ...row,
      draftActive: isActive,
      error: null,
      success: false,
    }));
  };

  const onSave = async (row: EditableUserRow): Promise<void> => {
    if (!canManage) {
      return;
    }

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

    updateRow(row.id, (current) => ({ ...current, saving: true, error: null, success: false }));

    try {
      const response = await fetch(`/api/users/${row.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { error?: string; issues?: Record<string, string>; user?: User };

      if (!response.ok) {
        throw new Error(body.issues ? Object.values(body.issues)[0] : body.error ?? "Failed to update user");
      }

      if (!body.user) {
        throw new Error("Invalid API response");
      }

      updateRow(row.id, () => ({ ...toEditableUser(body.user as User), success: true }));
    } catch (error) {
      updateRow(row.id, (current) => ({
        ...current,
        saving: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      }));
    }
  };

  const onRemove = async (row: EditableUserRow): Promise<void> => {
    if (!canManage) {
      return;
    }

    if (row.id === currentUserId || row.saving) {
      return;
    }

    const confirmed = window.confirm(`Remove user "${row.fullName}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    updateRow(row.id, (current) => ({ ...current, saving: true, error: null, success: false }));

    try {
      const response = await fetch(`/api/users/${row.id}`, { method: "DELETE" });

      if (!response.ok && response.status !== 204) {
        const body = (await response.json()) as { error?: string; issues?: Record<string, string> };
        throw new Error(body.issues ? Object.values(body.issues)[0] : body.error ?? "Failed to remove user");
      }

      setRows((current) => current.filter((item) => item.id !== row.id));
    } catch (error) {
      updateRow(row.id, (current) => ({
        ...current,
        saving: false,
        error: error instanceof Error ? error.message : "Failed to remove user",
      }));
    }
  };

  const onCreate = async (payload: CreateUserSchemaInput): Promise<void> => {
    if (!canManage) {
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json()) as { error?: string; issues?: Record<string, string>; user?: User };
      if (!response.ok) {
        throw new Error(body.issues ? Object.values(body.issues)[0] : body.error ?? "Failed to create user");
      }

      if (!body.user) {
        throw new Error("Invalid API response");
      }

      setRows((current) => [toEditableUser(body.user as User), ...current]);
      setShowAddUser(false);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const exportCsv = (): void => {
    const csv = toCsv(filteredRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "talentlens-users.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3.5">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-0.5">
        <div>
          <h2 className="text-[16px] font-bold tracking-tight text-slate-800">User Management</h2>
          <p className="mt-0.5 text-[11px] font-medium text-slate-400">Manage team access, roles, and permissions.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-wider"
          >
            <Download className="h-3 w-3 text-slate-400" />
            Export
          </button>
          <button
            type="button"
            onClick={() => setShowAddUser(true)}
            disabled={!canManage}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[11px] font-bold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 uppercase tracking-wider"
          >
            <Plus className="h-3.5 w-3.5" />
            Add User
          </button>
        </div>
      </header>

      {!canManage ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700">
          Read-only view. Only admins can create, update, or remove users.
        </div>
      ) : null}

      <UserMetricsCards users={rows.map((row) => ({ role: row.draftRole, isActive: row.draftActive }))} />

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <UsersTableControls
          query={query}
          roleFilter={roleFilter}
          onQueryChange={setQuery}
          onRoleFilterChange={setRoleFilter}
        />

        <UsersTable
          rows={filteredRows}
          currentUserId={currentUserId}
          canManage={canManage}
          onDraftRoleChange={onDraftRoleChange}
          onDraftActiveChange={onDraftActiveChange}
          onSave={onSave}
          onRemove={onRemove}
        />

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-2.5 text-[11px] font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between bg-slate-50/30">
          <p>
            Showing {filteredRows.length === 0 ? 0 : 1} to {filteredRows.length} of {rows.length} results
          </p>
          <div className="inline-flex items-center rounded-lg border border-slate-200 overflow-hidden bg-white">
            <button type="button" className="h-7 w-7 border-r border-slate-200 text-slate-400 hover:bg-slate-50" aria-label="Previous page">
              &lt;
            </button>
            <button type="button" className="h-7 min-w-[28px] bg-slate-900 px-2 text-[10px] font-bold text-white">
              1
            </button>
            <button type="button" className="h-7 min-w-[28px] border-l border-slate-200 px-2 text-[10px] font-medium text-slate-400 hover:bg-slate-50">
              2
            </button>
            <button type="button" className="h-7 w-7 border-l border-slate-200 text-slate-400 hover:bg-slate-50" aria-label="Next page">
              &gt;
            </button>
          </div>
        </div>
      </section>

      <RolePermissionsReference />

      <AddUserDialog
        open={showAddUser}
        submitting={creating}
        error={createError}
        onClose={() => {
          setShowAddUser(false);
          setCreateError(null);
        }}
        onSubmit={onCreate}
      />
    </div>
  );
}
