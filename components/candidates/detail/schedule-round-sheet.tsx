"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarClock,
  CalendarDays,
  ChevronDown,
  Clock3,
  Copy,
  UserRound,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ScheduleTypeSection } from "./scheduling/form-sections/schedule-type-section";
import { ScheduleInterviewerSection } from "./scheduling/form-sections/schedule-interviewer-section";
import { ScheduleLocationSection } from "./scheduling/form-sections/schedule-location-section";

import { ROUND_TYPES, type PipelineStage, type RoundType, type User } from "@/types/domain";

const DURATION_OPTIONS = [30, 45, 60] as const;

const STAGE_RAIL: Array<{ label: string; stage: PipelineStage }> = [
  { label: "Applied", stage: "APPLIED" },
  { label: "Screen", stage: "SCREENING" },
  { label: "Technical", stage: "TECHNICAL_L1" },
  { label: "Culture", stage: "HR" },
  { label: "Final", stage: "OFFER" },
  { label: "Offer", stage: "HIRED" },
];

const ScheduleRoundSheetSchema = z.object({
  round_type: z.enum(ROUND_TYPES),
  interviewer_id: z.string().trim().min(1, "Interviewer is required."),
  scheduled_at: z.string().trim().min(1, "Date and time are required."),
  instructions: z.string().trim().optional(),
  meeting_link: z.string().trim().optional(),
  duration: z.enum(["30", "45", "60"]),
});

type ScheduleRoundSheetValues = z.infer<typeof ScheduleRoundSheetSchema>;

function getDefaultRoundType(stage: PipelineStage): RoundType {
  switch (stage) {
    case "APPLIED":
      return "SCREENING";
    case "SCREENING":
      return "TECHNICAL_L1";
    case "TECHNICAL_L1":
      return "TECHNICAL_L2";
    case "TECHNICAL_L2":
      return "SYSTEM_DESIGN";
    case "SYSTEM_DESIGN":
      return "HR";
    case "HR":
      return "FINAL";
    default:
      return "SCREENING";
  }
}

function getDefaultValues(stage: PipelineStage): ScheduleRoundSheetValues {
  return {
    round_type: getDefaultRoundType(stage),
    interviewer_id: "",
    scheduled_at: "",
    instructions: "",
    meeting_link: "",
    duration: "60",
  };
}

function toRoundLabel(roundType: RoundType): string {
  return roundType
    .toLowerCase()
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function resolveStageRailIndex(stage: PipelineStage): number {
  const index = STAGE_RAIL.findIndex((item) => item.stage === stage);
  if (index === -1) {
    return 0;
  }
  return Math.min(index + 1, STAGE_RAIL.length - 1);
}

interface ScheduleRoundSheetProps {
  candidateId: string;
  candidateName: string;
  appliedRole: string;
  currentStage: PipelineStage;
  interviewers: User[];
}

export function ScheduleRoundSheet({
  candidateId,
  candidateName,
  appliedRole,
  currentStage,
  interviewers,
}: ScheduleRoundSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoGenerateLink, setAutoGenerateLink] = useState(true);

  const stageIndex = useMemo(() => resolveStageRailIndex(currentStage), [currentStage]);
  const defaultValues = useMemo(() => getDefaultValues(currentStage), [currentStage]);

  const form = useForm<ScheduleRoundSheetValues>({
    resolver: zodResolver(ScheduleRoundSheetSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("keydown", onEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = (): void => {
    setOpen(false);
    setError(null);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const date = new Date(values.scheduled_at);
      if (Number.isNaN(date.getTime())) {
        throw new Error("Please choose a valid date and time.");
      }

      const response = await fetch(`/api/candidates/${candidateId}/rounds`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          round_type: values.round_type,
          interviewer_id: values.interviewer_id,
          scheduled_at: date.toISOString(),
        }),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to schedule round");
      }

      form.reset(defaultValues);
      close();
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to schedule round");
    } finally {
      setSubmitting(false);
    }
  });

  const roundedMeetingLink = form.watch("meeting_link");
  const meetingLinkValue = autoGenerateLink
    ? roundedMeetingLink?.trim() || "https://meet.google.com/abc-defg-hij"
    : roundedMeetingLink ?? "";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          form.reset(defaultValues);
          setError(null);
          setOpen(true);
        }}
        disabled={interviewers.length === 0}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <CalendarClock className="h-4 w-4" />
        Schedule
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex justify-end bg-gray-900/50 backdrop-blur-[2px]">
          <button type="button" aria-label="Close scheduler" className="h-full flex-1 cursor-default" onClick={close} />

          <aside className="flex h-full w-full max-w-2xl flex-col border-l border-gray-200 bg-white shadow-2xl">
            <header className="sticky top-0 z-10 border-b border-slate-100 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-bold tracking-tight text-slate-800 uppercase">Schedule Next Round</h2>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                    Candidate: <span className="text-slate-600 underline underline-offset-2">{candidateName}</span> • {appliedRole}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col bg-slate-50/20">
              <div className="flex-1 space-y-7 overflow-y-auto p-5 custom-scrollbar">
                {/* Stage Rail Section */}
                <section className="px-1 pt-2">
                  <div className="relative">
                    <div className="absolute left-[5%] right-[5%] top-3.5 h-[1px] bg-slate-100" />
                    <div
                      className="absolute left-[5%] top-3.5 h-[1.5px] bg-slate-900 transition-all duration-500"
                      style={{ width: `${(stageIndex / (STAGE_RAIL.length - 1)) * 90}%` }}
                    />
                    <div className="relative flex items-start justify-between">
                      {STAGE_RAIL.map((step, index) => {
                        const completed = index < stageIndex;
                        const active = index === stageIndex;
                        return (
                          <div key={step.label} className="flex flex-col items-center gap-1.5">
                            <span
                              className={[
                                "relative z-10 inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300",
                                completed
                                  ? "bg-slate-900 text-white shadow-sm"
                                  : active
                                    ? "bg-slate-900 text-white ring-4 ring-slate-100 shadow-md shadow-slate-900/10"
                                    : "border border-slate-200 bg-white text-slate-300",
                              ].join(" ")}
                            >
                              {completed ? "✓" : index + 1}
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${completed || active ? "text-slate-800" : "text-slate-300"}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <div className="space-y-6">
                  <ScheduleTypeSection
                    register={form.register}
                    duration={form.watch("duration")}
                    onDurationChange={(val) => form.setValue("duration", val as any)}
                  />

                  <ScheduleInterviewerSection
                    register={form.register}
                    interviewers={interviewers}
                    errors={form.formState.errors}
                  />

                  <ScheduleLocationSection
                    register={form.register}
                    autoGenerateLink={autoGenerateLink}
                    onToggleAutoGenerate={() => setAutoGenerateLink(!autoGenerateLink)}
                    meetingLinkValue={meetingLinkValue}
                  />
                </div>

                {error ? (
                  <p className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-bold uppercase tracking-tight text-rose-600 animate-in fade-in slide-in-from-top-1">
                    {error}
                  </p>
                ) : null}
              </div>

              <footer className="sticky bottom-0 border-t border-slate-100 bg-white px-5 py-3.5 flex items-center justify-between">
                <button type="button" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">
                  Save as Draft
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="h-8 rounded-lg border border-slate-200 bg-white px-4 text-[11px] font-bold text-slate-500 hover:bg-slate-50 uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-[11px] font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 uppercase tracking-wider transition-all shadow-md shadow-slate-900/10 active:scale-95"
                  >
                    <Clock3 className="h-3.5 w-3.5" />
                    {submitting ? "Inviting..." : "Confirm & Send Invite"}
                  </button>
                </div>
              </footer>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
