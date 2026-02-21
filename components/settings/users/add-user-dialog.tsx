"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import { CreateUserSchema, type CreateUserSchemaInput } from "@/types/schemas";
import type { UserRole } from "@/types/domain";

interface AddUserDialogProps {
  open: boolean;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: CreateUserSchemaInput) => Promise<void>;
}

type AddUserFormValues = {
  full_name: string;
  company_name?: string;
  email: string;
  password: string;
  role: UserRole;
  is_active?: boolean;
};

const defaults: AddUserFormValues = {
  full_name: "",
  company_name: "",
  email: "",
  password: "",
  role: "INTERVIEWER",
  is_active: true,
};

export function AddUserDialog({ open, submitting, error, onClose, onSubmit }: AddUserDialogProps) {
  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: defaults,
  });
  const isActive = useWatch({
    control: form.control,
    name: "is_active",
  });

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Add User</h3>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-4 px-5 py-5"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit({
              ...values,
              is_active: Boolean(values.is_active),
            });
            form.reset(defaults);
          })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Full Name</span>
              <input
                {...form.register("full_name")}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-slate-500"
              />
              {form.formState.errors.full_name ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{form.formState.errors.full_name.message}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Work Email</span>
              <input
                type="email"
                {...form.register("email")}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-slate-500"
              />
              {form.formState.errors.email ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{form.formState.errors.email.message}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Temporary Password</span>
              <input
                type="password"
                {...form.register("password")}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-slate-500"
              />
              {form.formState.errors.password ? (
                <p className="mt-1 text-xs font-medium text-rose-600">{form.formState.errors.password.message}</p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Role</span>
              <select
                {...form.register("role")}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-slate-500"
              >
                <option value="ADMIN">Admin</option>
                <option value="RECRUITER">Recruiter</option>
                <option value="HIRING_MANAGER">Hiring Manager</option>
                <option value="INTERVIEWER">Interviewer</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Company Name (Optional)</span>
              <input
                {...form.register("company_name")}
                className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 outline-none focus:border-slate-500"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={Boolean(isActive)}
              onChange={(event) => form.setValue("is_active", event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
            />
            Create as active user
          </label>

          {error ? <p className="text-sm font-medium text-rose-700">{error}</p> : null}

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-10 items-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
