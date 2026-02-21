import type { UseFormReturn } from "react-hook-form";

import { REJECTION_CATEGORIES } from "@/types/domain";
import type { SubmitFeedbackSchemaInput } from "@/types/schemas";

import { formatEnumLabel } from "@/components/candidates/detail/candidate-detail.utils";

interface RejectionDetailsCardProps {
  form: UseFormReturn<SubmitFeedbackSchemaInput>;
}

export function RejectionDetailsCard({ form }: RejectionDetailsCardProps) {
  return (
    <section className="space-y-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4">
      <div>
        <h3 className="text-sm font-semibold text-rose-700">Rejection details required</h3>
        <p className="mt-0.5 text-[11px] text-rose-600">Select a category and add at least 20 characters of notes.</p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-rose-700">Category</span>
        <select
          {...form.register("rejection.category")}
          className="h-9 w-full rounded-lg border border-rose-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-rose-300"
        >
          <option value="">Select reason...</option>
          {REJECTION_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {formatEnumLabel(item)}
            </option>
          ))}
        </select>
        {form.formState.errors.rejection?.category ? (
          <p className="text-[11px] font-medium text-rose-700">{form.formState.errors.rejection.category.message}</p>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-[12px] font-medium text-rose-700">Notes</span>
        <textarea
          rows={4}
          {...form.register("rejection.notes")}
          placeholder="Explain why the candidate should not continue..."
          className="w-full resize-none rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-300"
        />
        <p className="text-[11px] text-rose-600">Minimum 20 characters.</p>
        {form.formState.errors.rejection?.notes ? (
          <p className="text-[11px] font-medium text-rose-700">{form.formState.errors.rejection.notes.message}</p>
        ) : null}
      </label>
    </section>
  );
}
