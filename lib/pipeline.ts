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

export const PIPELINE_PROGRESSION: PipelineStage[] = [
  "APPLIED",
  "SCREENING",
  "TECHNICAL_L1",
  "TECHNICAL_L2",
  "SYSTEM_DESIGN",
  "HR",
  "OFFER",
  "HIRED",
];

export function getNextPipelineStage(stage: PipelineStage): PipelineStage | null {
  const index = PIPELINE_PROGRESSION.indexOf(stage);
  if (index < 0 || index >= PIPELINE_PROGRESSION.length - 1) {
    return null;
  }

  return PIPELINE_PROGRESSION[index + 1];
}

export function getAdvanceStageOptions(stage: PipelineStage): PipelineStage[] {
  const index = PIPELINE_PROGRESSION.indexOf(stage);
  if (index < 0 || index >= PIPELINE_PROGRESSION.length - 1) {
    return [];
  }

  return PIPELINE_PROGRESSION.slice(index + 1);
}

export function isValidPipelineStage(value: string): value is PipelineStage {
  return PIPELINE_STAGES.includes(value as PipelineStage);
}
