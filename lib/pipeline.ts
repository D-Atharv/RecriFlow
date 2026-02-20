import { PIPELINE_STAGES, type PipelineStage } from "@/types/domain";

export const STAGE_LABELS: Record<PipelineStage, string> = {
  APPLIED: "Applied",
  SCREENING: "Screening",
  TECHNICAL_L1: "Technical L1",
  TECHNICAL_L2: "Technical L2",
  SYSTEM_DESIGN: "System Design",
  HR: "HR",
  OFFER: "Offer",
  HIRED: "Hired",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export function stageAgeTone(daysInStage: number): "ok" | "warn" | "risk" {
  if (daysInStage <= 4) {
    return "ok";
  }

  if (daysInStage <= 10) {
    return "warn";
  }

  return "risk";
}

export const KANBAN_STAGES: PipelineStage[] = [
  "APPLIED",
  "SCREENING",
  "TECHNICAL_L1",
  "TECHNICAL_L2",
  "SYSTEM_DESIGN",
  "HR",
  "OFFER",
  "REJECTED",
];

export function isValidPipelineStage(value: string): value is PipelineStage {
  return PIPELINE_STAGES.includes(value as PipelineStage);
}
