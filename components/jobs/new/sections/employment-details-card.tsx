"use client";

import { useFormContext } from "react-hook-form";

import { EMPLOYMENT_TYPE_OPTIONS, type CreateJobOpeningValues } from "@/components/jobs/new/create-job.schema";

const EMPLOYMENT_TYPE_LABELS: Record<(typeof EMPLOYMENT_TYPE_OPTIONS)[number], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
};

export function EmploymentDetailsCard() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateJobOpeningValues>();

  const selectedType = watch("employmentType");

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-bold text-gray-900">Employment Details</h3>
      </header>

      <div className="space-y-4 px-4 py-4">
        <fieldset>
          <legend className="text-xs font-medium text-gray-700">Employment Type</legend>
          <div className="mt-3 space-y-2">
            {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2 text-xs text-gray-700">
                <input
                  type="radio"
                  value={option}
                  checked={selectedType === option}
                  {...register("employmentType")}
                  className="h-4 w-4 border-gray-300 text-slate-900 focus:ring-slate-500"
                />
                {EMPLOYMENT_TYPE_LABELS[option]}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <p className="text-xs font-medium text-gray-700">Experience Range</p>
          <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="number"
              min={0}
              step="0.5"
              {...register("experienceMin", { valueAsNumber: true })}
              placeholder="Min"
              className="h-9 rounded-xl border border-gray-200 px-3 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-slate-500"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="number"
              min={0}
              step="0.5"
              {...register("experienceMax", { valueAsNumber: true })}
              placeholder="Max"
              className="h-9 rounded-xl border border-gray-200 px-3 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-slate-500"
            />
          </div>
          {errors.experienceMin ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.experienceMin.message}</p> : null}
          {errors.experienceMax ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.experienceMax.message}</p> : null}
        </div>
      </div>
    </section>
  );
}
