"use client";

import { useFormContext } from "react-hook-form";

import type { CreateJobOpeningValues } from "@/components/jobs/new/create-job.schema";

export function VisibilityCard() {
  const { register, watch } = useFormContext<CreateJobOpeningValues>();
  const internalVisible = watch("isInternalVisible");
  const publicVisible = watch("isPublicVisible");

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">Visibility</h3>
      </header>

      <div className="space-y-4 px-4 py-4">
        <label className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Internal Job Board</p>
            <p className="text-sm text-gray-500">Visible to employees only.</p>
          </div>
          <input
            type="checkbox"
            {...register("isInternalVisible")}
            checked={internalVisible}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
          />
        </label>

        <label className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Public Career Page</p>
            <p className="text-sm text-gray-500">Visible on your careers website.</p>
          </div>
          <input
            type="checkbox"
            {...register("isPublicVisible")}
            checked={publicVisible}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-slate-900 focus:ring-slate-500"
          />
        </label>
      </div>
    </section>
  );
}
