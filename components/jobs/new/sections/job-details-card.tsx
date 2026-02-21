"use client";

import { FileText } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { JOB_DEPARTMENT_OPTIONS, type CreateJobOpeningValues } from "@/components/jobs/new/create-job.schema";

export function JobDetailsCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateJobOpeningValues>();

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <FileText className="h-4 w-4 text-gray-400" />
        <h2 className="text-sm font-bold tracking-tight text-gray-900">Job Details</h2>
      </header>

      <div className="space-y-4 px-4 py-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Job Title</span>
          <input
            {...register("title")}
            placeholder="e.g. Senior Product Designer"
            className="h-9 w-full rounded-xl border border-gray-200 px-3 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-slate-500"
          />
          {errors.title ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.title.message}</p> : null}
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Department</span>
            <select
              {...register("department")}
              className="h-9 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs text-gray-900 outline-none transition-colors focus:border-slate-500"
            >
              {JOB_DEPARTMENT_OPTIONS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.department.message}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">Location</span>
            <input
              {...register("location")}
              placeholder="Remote, New York, etc."
              className="h-9 w-full rounded-xl border border-gray-200 px-3 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-slate-500"
            />
            <p className="mt-1 text-xs text-gray-400">Metadata only in phase 1 (not used in matching logic yet).</p>
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Required Skills</span>
          <input
            {...register("requiredSkillsText")}
            placeholder="React, TypeScript, System Design"
            className="h-9 w-full rounded-xl border border-gray-200 px-3 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-slate-500"
          />
          {errors.requiredSkillsText ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.requiredSkillsText.message}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Comma-separated list used for candidate-job matching.</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Description</span>
          <textarea
            rows={9}
            {...register("description")}
            placeholder="Describe responsibilities, required outcomes, and interview expectations..."
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-slate-500"
          />
          {errors.description ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.description.message}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">This text is visible on job detail and used by recruiters during screening.</p>
          )}
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">Core Responsibilities</span>
          <textarea
            rows={5}
            {...register("coreResponsibilitiesText")}
            placeholder={"Write one responsibility per line.\nExample:\nLead frontend architecture and code quality reviews."}
            className="w-full rounded-xl border border-gray-200 px-3 py-3 text-xs text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-slate-500"
          />
          {errors.coreResponsibilitiesText ? (
            <p className="mt-1 text-xs font-medium text-rose-600">{errors.coreResponsibilitiesText.message}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Used to render the Core Responsibilities section on the job details page.</p>
          )}
        </label>
      </div>
    </section>
  );
}
