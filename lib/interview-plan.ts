import {
  JOB_OUTCOME_STAGES,
  ROUND_TYPES,
  type InterviewPlanStep,
  type InterviewPlanStepKind,
  type JobOutcomeStage,
  type RoundType,
} from "@/types/domain";

export interface InterviewPlanCatalogOption {
  id: string;
  label: string;
  kind: InterviewPlanStepKind;
  roundType: RoundType | null;
  outcomeStage: JobOutcomeStage | null;
}

export interface InterviewPlanTemplate {
  id: string;
  name: string;
  description: string;
  steps: InterviewPlanStep[];
}

function makeRoundStep(key: string, label: string, roundType: RoundType): InterviewPlanStep {
  return {
    key,
    label,
    kind: "ROUND",
    roundType,
    outcomeStage: null,
  };
}

function makeOutcomeStep(key: string, label: string, outcomeStage: JobOutcomeStage): InterviewPlanStep {
  return {
    key,
    label,
    kind: "OUTCOME",
    roundType: null,
    outcomeStage,
  };
}

export const INTERVIEW_PLAN_CATALOG: InterviewPlanCatalogOption[] = [
  { id: "screening", label: "Screening", kind: "ROUND", roundType: "SCREENING", outcomeStage: null },
  { id: "machine-coding", label: "Technical L1", kind: "ROUND", roundType: "TECHNICAL_L1", outcomeStage: null },
  { id: "dsa", label: "Technical L2", kind: "ROUND", roundType: "TECHNICAL_L2", outcomeStage: null },
  { id: "system-design", label: "System Design", kind: "ROUND", roundType: "SYSTEM_DESIGN", outcomeStage: null },
  { id: "culture-fit", label: "Culture Fit", kind: "ROUND", roundType: "CULTURE_FIT", outcomeStage: null },
  { id: "hr", label: "HR", kind: "ROUND", roundType: "HR", outcomeStage: null },
  { id: "final-round", label: "Final Interview", kind: "ROUND", roundType: "FINAL", outcomeStage: null },
  { id: "offer", label: "Offer", kind: "OUTCOME", roundType: null, outcomeStage: "OFFER" },
  { id: "hired", label: "Hired", kind: "OUTCOME", roundType: null, outcomeStage: "HIRED" },
];

export const INTERVIEW_PLAN_TEMPLATES: InterviewPlanTemplate[] = [
  {
    id: "ENGINEERING_STANDARD",
    name: "Engineering Standard",
    description: "Screening → Technical L1 → Technical L2 → System Design → HR → Offer → Hired",
    steps: [
      makeRoundStep("screening", "Screening", "SCREENING"),
      makeRoundStep("machine-coding", "Technical L1", "TECHNICAL_L1"),
      makeRoundStep("dsa", "Technical L2", "TECHNICAL_L2"),
      makeRoundStep("system-design", "System Design", "SYSTEM_DESIGN"),
      makeRoundStep("hr", "HR", "HR"),
      makeOutcomeStep("offer", "Offer", "OFFER"),
      makeOutcomeStep("hired", "Hired", "HIRED"),
    ],
  },
  {
    id: "FRONTEND_FOCUSED",
    name: "Frontend Focused",
    description: "Screening → Machine Coding → UI Architecture → Culture Fit → Offer → Hired",
    steps: [
      makeRoundStep("screening", "Screening", "SCREENING"),
      makeRoundStep("machine-coding", "Machine Coding", "TECHNICAL_L1"),
      makeRoundStep("ui-architecture", "UI Architecture", "TECHNICAL_L2"),
      makeRoundStep("culture-fit", "Culture Fit", "CULTURE_FIT"),
      makeOutcomeStep("offer", "Offer", "OFFER"),
      makeOutcomeStep("hired", "Hired", "HIRED"),
    ],
  },
  {
    id: "BACKEND_FOCUSED",
    name: "Backend Focused",
    description: "Screening → DSA → System Design → HR → Offer → Hired",
    steps: [
      makeRoundStep("screening", "Screening", "SCREENING"),
      makeRoundStep("dsa", "DSA", "TECHNICAL_L1"),
      makeRoundStep("system-design", "System Design", "SYSTEM_DESIGN"),
      makeRoundStep("hr", "HR", "HR"),
      makeOutcomeStep("offer", "Offer", "OFFER"),
      makeOutcomeStep("hired", "Hired", "HIRED"),
    ],
  },
  {
    id: "PRODUCT_MANAGER",
    name: "Product Manager",
    description: "Screening → Product Case → System Thinking → Leadership → Offer → Hired",
    steps: [
      makeRoundStep("screening", "Screening", "SCREENING"),
      makeRoundStep("product-case", "Product Case", "TECHNICAL_L1"),
      makeRoundStep("system-thinking", "System Thinking", "SYSTEM_DESIGN"),
      makeRoundStep("leadership", "Leadership", "FINAL"),
      makeOutcomeStep("offer", "Offer", "OFFER"),
      makeOutcomeStep("hired", "Hired", "HIRED"),
    ],
  },
];

export const DEFAULT_INTERVIEW_PLAN_TEMPLATE_ID = "ENGINEERING_STANDARD";

export const ROUND_TYPE_LABELS: Record<RoundType, string> = {
  SCREENING: "Screening",
  TECHNICAL_L1: "Technical L1",
  TECHNICAL_L2: "Technical L2",
  SYSTEM_DESIGN: "System Design",
  HR: "HR",
  CULTURE_FIT: "Culture Fit",
  FINAL: "Final",
};

export const OUTCOME_STAGE_LABELS: Record<JobOutcomeStage, string> = {
  OFFER: "Offer",
  HIRED: "Hired",
};

export function cloneInterviewPlan(steps: InterviewPlanStep[]): InterviewPlanStep[] {
  return steps.map((step) => ({ ...step }));
}

export function getInterviewPlanTemplate(templateId: string): InterviewPlanTemplate | null {
  return INTERVIEW_PLAN_TEMPLATES.find((template) => template.id === templateId) ?? null;
}

export function getDefaultInterviewPlan(): InterviewPlanStep[] {
  const template = getInterviewPlanTemplate(DEFAULT_INTERVIEW_PLAN_TEMPLATE_ID);
  if (!template) {
    return [];
  }
  return cloneInterviewPlan(template.steps);
}

export function createInterviewPlanStepFromOption(optionId: string, suffix: string): InterviewPlanStep | null {
  const option = INTERVIEW_PLAN_CATALOG.find((item) => item.id === optionId);
  if (!option) {
    return null;
  }

  return {
    key: `${option.id}-${suffix}`,
    label: option.label,
    kind: option.kind,
    roundType: option.roundType,
    outcomeStage: option.outcomeStage,
  };
}

export function normalizeInterviewPlan(plan: InterviewPlanStep[]): InterviewPlanStep[] {
  return plan.map((step, index) => ({
    key: step.key || `step-${index + 1}`,
    label: step.label.trim(),
    kind: step.kind,
    roundType: step.kind === "ROUND" ? step.roundType : null,
    outcomeStage: step.kind === "OUTCOME" ? step.outcomeStage : null,
  }));
}

function stableStepSignature(step: InterviewPlanStep): string {
  return [step.label.trim().toLowerCase(), step.kind, step.roundType ?? "", step.outcomeStage ?? ""].join("|");
}

export function resolveTemplateIdFromPlan(plan: InterviewPlanStep[]): string {
  const target = normalizeInterviewPlan(plan).map(stableStepSignature);

  for (const template of INTERVIEW_PLAN_TEMPLATES) {
    const templateSignature = normalizeInterviewPlan(template.steps).map(stableStepSignature);
    if (templateSignature.length !== target.length) {
      continue;
    }

    if (templateSignature.every((signature, index) => signature === target[index])) {
      return template.id;
    }
  }

  return "CUSTOM";
}

export function isRoundType(value: string): value is RoundType {
  return ROUND_TYPES.includes(value as RoundType);
}

export function isOutcomeStage(value: string): value is JobOutcomeStage {
  return JOB_OUTCOME_STAGES.includes(value as JobOutcomeStage);
}
