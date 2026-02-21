"use client";

import { ArrowDown, ArrowUp, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import type { CreateJobOpeningValues } from "@/components/jobs/new/create-job.schema";
import {
  INTERVIEW_PLAN_CATALOG,
  INTERVIEW_PLAN_TEMPLATES,
  createInterviewPlanStepFromOption,
  getInterviewPlanTemplate,
  OUTCOME_STAGE_LABELS,
  ROUND_TYPE_LABELS,
} from "@/lib/interview-plan";
import { type InterviewPlanStepKind, JOB_OUTCOME_STAGES, ROUND_TYPES } from "@/types/domain";

const CUSTOM_TEMPLATE_ID = "CUSTOM";

function nextStepKeySuffix(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function InterviewPlanCard() {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreateJobOpeningValues>();
  const [catalogSelection, setCatalogSelection] = useState(INTERVIEW_PLAN_CATALOG[0]?.id ?? "screening");

  const { fields, append, move, remove, replace } = useFieldArray({
    control,
    name: "interviewPlan",
  });

  const templateId = watch("interviewPlanTemplateId");
  const currentPlan = watch("interviewPlan");

  const applyTemplate = (value: string): void => {
    setValue("interviewPlanTemplateId", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (value === CUSTOM_TEMPLATE_ID) {
      return;
    }

    const template = getInterviewPlanTemplate(value);
    if (!template) {
      return;
    }

    replace(template.steps.map((step) => ({ ...step })));
  };

  const markTemplateAsCustom = (): void => {
    if (templateId === CUSTOM_TEMPLATE_ID) {
      return;
    }
    setValue("interviewPlanTemplateId", CUSTOM_TEMPLATE_ID, {
      shouldDirty: true,
    });
  };

  const addStep = (): void => {
    const step = createInterviewPlanStepFromOption(catalogSelection, nextStepKeySuffix());
    if (!step) {
      return;
    }

    append(step, {
      shouldFocus: false,
    });
    markTemplateAsCustom();
  };

  const templateDescription =
    templateId === CUSTOM_TEMPLATE_ID
      ? "Custom plan. Reorder, rename, and add rounds as needed."
      : INTERVIEW_PLAN_TEMPLATES.find((template) => template.id === templateId)?.description ??
      "Choose a template and tailor it for this role.";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-gray-100 px-4 py-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight text-gray-900">
            <Sparkles className="h-3.5 w-3.5 text-slate-500" />
            Interview Flow Template
          </h2>
          <p className="mt-1 text-[11px] text-gray-500">{templateDescription}</p>
        </div>
      </header>

      <div className="space-y-4 px-4 py-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-gray-600">Start from template</span>
            <select
              value={templateId}
              onChange={(event) => applyTemplate(event.target.value)}
              className="h-8 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-900 outline-none focus:border-slate-500"
            >
              {INTERVIEW_PLAN_TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
              <option value={CUSTOM_TEMPLATE_ID}>Custom</option>
            </select>
          </label>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 md:min-w-[320px]">
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-gray-600">Add step</span>
              <select
                value={catalogSelection}
                onChange={(event) => setCatalogSelection(event.target.value)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] text-gray-900 outline-none focus:border-slate-500"
              >
                {INTERVIEW_PLAN_CATALOG.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={addStep}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 text-[11px] font-semibold text-slate-700 hover:bg-gray-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>

        <ol className="space-y-2">
          {fields.map((field, index) => {
            const step = currentPlan[index];
            const kindRegister = register(`interviewPlan.${index}.kind`);
            const labelRegister = register(`interviewPlan.${index}.label`);
            const roundTypeRegister = register(`interviewPlan.${index}.roundType`);
            const outcomeStageRegister = register(`interviewPlan.${index}.outcomeStage`);
            const stepKind = step?.kind ?? "ROUND";

            return (
              <li key={field.id} className="rounded-lg border border-gray-200 bg-gray-50/40 px-2.5 py-2">
                <div className="grid items-center gap-2 sm:grid-cols-[24px_minmax(0,1fr)_110px_120px_auto]">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-slate-700 ring-1 ring-gray-200">
                    {index + 1}
                  </span>

                  <div className="flex flex-col gap-1">
                    <input
                      {...labelRegister}
                      onChange={(event) => {
                        labelRegister.onChange(event);
                        markTemplateAsCustom();
                      }}
                      className={[
                        "h-7 rounded-md border bg-white px-2 text-[11px] text-gray-900 outline-none focus:border-slate-500",
                        errors.interviewPlan?.[index]?.label ? "border-rose-300 ring-rose-300" : "border-gray-200",
                      ].join(" ")}
                    />
                    {errors.interviewPlan?.[index]?.label && (
                      <p className="text-[9px] font-medium text-rose-600">
                        {errors.interviewPlan[index]?.label?.message}
                      </p>
                    )}
                  </div>

                  <select
                    {...kindRegister}
                    onChange={(event) => {
                      kindRegister.onChange(event);
                      const kind = event.target.value as InterviewPlanStepKind;
                      if (kind === "ROUND") {
                        setValue(`interviewPlan.${index}.roundType`, step?.roundType ?? "SCREENING", { shouldValidate: true });
                        setValue(`interviewPlan.${index}.outcomeStage`, null, { shouldValidate: true });
                      } else {
                        setValue(`interviewPlan.${index}.roundType`, null, { shouldValidate: true });
                        setValue(`interviewPlan.${index}.outcomeStage`, step?.outcomeStage ?? "OFFER", { shouldValidate: true });
                      }
                      markTemplateAsCustom();
                    }}
                    className="h-7 rounded-md border border-gray-200 bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-slate-500"
                  >
                    <option value="ROUND">Round</option>
                    <option value="OUTCOME">Outcome</option>
                  </select>

                  {stepKind === "ROUND" ? (
                    <select
                      {...roundTypeRegister}
                      value={step?.roundType ?? "SCREENING"}
                      onChange={(event) => {
                        roundTypeRegister.onChange(event);
                        markTemplateAsCustom();
                      }}
                      className="h-7 rounded-md border border-gray-200 bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-slate-500"
                    >
                      {ROUND_TYPES.map((roundType) => (
                        <option key={roundType} value={roundType}>
                          {ROUND_TYPE_LABELS[roundType]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      {...outcomeStageRegister}
                      value={step?.outcomeStage ?? "OFFER"}
                      onChange={(event) => {
                        outcomeStageRegister.onChange(event);
                        markTemplateAsCustom();
                      }}
                      className="h-7 rounded-md border border-gray-200 bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-slate-500"
                    >
                      {JOB_OUTCOME_STAGES.map((outcomeStage) => (
                        <option key={outcomeStage} value={outcomeStage}>
                          {OUTCOME_STAGE_LABELS[outcomeStage]}
                        </option>
                      ))}
                    </select>
                  )}

                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (index === 0) {
                          return;
                        }
                        move(index, index - 1);
                        markTemplateAsCustom();
                      }}
                      disabled={index === 0}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Move step up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (index >= fields.length - 1) {
                          return;
                        }
                        move(index, index + 1);
                        markTemplateAsCustom();
                      }}
                      disabled={index >= fields.length - 1}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Move step down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (fields.length <= 1) {
                          return;
                        }
                        remove(index);
                        markTemplateAsCustom();
                      }}
                      disabled={fields.length <= 1}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Remove step"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {errors.interviewPlan ? (
          <p className="text-[11px] font-medium text-rose-600">{errors.interviewPlan.message as string}</p>
        ) : null}
      </div>
    </section>
  );
}
