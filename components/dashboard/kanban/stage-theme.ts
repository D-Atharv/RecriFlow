import type { PipelineStage } from "@/types/domain";

export interface StageTheme {
  columnAccentClass: string;
  badgeClass: string;
  statusDotClass: string;
}

export const STAGE_THEME: Record<PipelineStage, StageTheme> = {
  APPLIED: {
    columnAccentClass: "border-t-slate-300",
    badgeClass: "bg-slate-100 text-slate-600",
    statusDotClass: "bg-slate-500",
  },
  SCREENING: {
    columnAccentClass: "border-t-slate-400",
    badgeClass: "bg-slate-100 text-slate-700",
    statusDotClass: "bg-slate-400",
  },
  TECHNICAL_L1: {
    columnAccentClass: "border-t-slate-500",
    badgeClass: "bg-slate-100 text-slate-800",
    statusDotClass: "bg-slate-500",
  },
  TECHNICAL_L2: {
    columnAccentClass: "border-t-slate-600",
    badgeClass: "bg-slate-100 text-slate-900",
    statusDotClass: "bg-slate-600",
  },
  SYSTEM_DESIGN: {
    columnAccentClass: "border-t-slate-700",
    badgeClass: "bg-slate-100 text-slate-900",
    statusDotClass: "bg-slate-700",
  },
  HR: {
    columnAccentClass: "border-t-slate-800",
    badgeClass: "bg-slate-100 text-slate-900",
    statusDotClass: "bg-slate-800",
  },
  OFFER: {
    columnAccentClass: "border-t-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-700",
    statusDotClass: "bg-emerald-500",
  },
  HIRED: {
    columnAccentClass: "border-t-green-600",
    badgeClass: "bg-green-100 text-green-700",
    statusDotClass: "bg-green-600",
  },
  REJECTED: {
    columnAccentClass: "border-t-rose-500",
    badgeClass: "bg-rose-100 text-rose-700",
    statusDotClass: "bg-rose-500",
  },
  WITHDRAWN: {
    columnAccentClass: "border-t-amber-500",
    badgeClass: "bg-amber-100 text-amber-700",
    statusDotClass: "bg-amber-500",
  },
};
