import type {
  Candidate as PrismaCandidate,
  Feedback as PrismaFeedback,
  InterviewRound as PrismaInterviewRound,
  Job as PrismaJob,
  Prisma,
  RejectionReason as PrismaRejectionReason,
  SyncLog as PrismaSyncLog,
  User as PrismaUser,
} from "@prisma/client";

import type { AuthUserRecord } from "@/types/auth";
import type {
  Candidate,
  Feedback,
  InterviewPlanStep,
  InterviewPlanStepKind,
  InterviewRound,
  Job,
  RejectionReason,
  RoundType,
  SyncLog,
  User,
  JobOutcomeStage,
} from "@/types/domain";
import { getDefaultInterviewPlan, isOutcomeStage, isRoundType } from "@/lib/interview-plan";

export const candidateWithRelationsArgs = {
  include: {
    interview_rounds: {
      include: {
        feedback: true,
        interviewer: true,
      },
      orderBy: {
        round_number: "asc",
      },
    },
    rejection: true,
  },
} as const satisfies Prisma.CandidateDefaultArgs;

export type CandidateWithRelations = Prisma.CandidateGetPayload<typeof candidateWithRelationsArgs>;

export const roundWithRelationsArgs = {
  include: {
    feedback: true,
    interviewer: true,
  },
} as const satisfies Prisma.InterviewRoundDefaultArgs;

export type RoundWithRelations = Prisma.InterviewRoundGetPayload<typeof roundWithRelationsArgs>;

function toIso(value: Date): string {
  return value.toISOString();
}

function isInterviewPlanStepKind(value: unknown): value is InterviewPlanStepKind {
  return value === "ROUND" || value === "OUTCOME";
}

function toDomainInterviewPlan(value: Prisma.JsonValue): InterviewPlanStep[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const key = typeof record.key === "string" && record.key.trim().length > 0 ? record.key.trim() : `step-${index + 1}`;
      const label = typeof record.label === "string" && record.label.trim().length > 0 ? record.label.trim() : `Step ${index + 1}`;
      const kind = isInterviewPlanStepKind(record.kind) ? record.kind : "ROUND";
      const roundType: RoundType | null =
        typeof record.roundType === "string" && isRoundType(record.roundType) ? record.roundType : null;
      const outcomeStage: JobOutcomeStage | null =
        typeof record.outcomeStage === "string" && isOutcomeStage(record.outcomeStage) ? record.outcomeStage : null;

      if (kind === "ROUND" && !roundType) {
        return null;
      }
      if (kind === "OUTCOME" && !outcomeStage) {
        return null;
      }

      return {
        key,
        label,
        kind,
        roundType: kind === "ROUND" ? roundType : null,
        outcomeStage: kind === "OUTCOME" ? outcomeStage : null,
      } satisfies InterviewPlanStep;
    })
    .filter((step): step is InterviewPlanStep => step !== null);
}

export function toAuthUserRecord(record: PrismaUser): AuthUserRecord {
  return {
    id: record.id,
    email: record.email,
    fullName: record.full_name,
    companyName: record.company_name,
    role: record.role,
    passwordHash: record.password_hash,
    isActive: record.is_active,
    createdAt: toIso(record.created_at),
    updatedAt: toIso(record.updated_at),
  };
}

export function toDomainUser(record: PrismaUser): User {
  return {
    id: record.id,
    email: record.email,
    fullName: record.full_name,
    role: record.role,
    isActive: record.is_active,
    createdAt: toIso(record.created_at),
    updatedAt: toIso(record.updated_at),
  };
}

export function toDomainJob(record: PrismaJob): Job {
  const parsedInterviewPlan = toDomainInterviewPlan(record.interview_plan);

  return {
    id: record.id,
    title: record.title,
    department: record.department,
    description: record.description,
    coreResponsibilities: record.core_responsibilities,
    interviewPlan: parsedInterviewPlan.length > 0 ? parsedInterviewPlan : getDefaultInterviewPlan(),
    requiredSkills: record.required_skills,
    experienceMin: record.experience_min,
    experienceMax: record.experience_max,
    status: record.status,
    createdById: record.created_by_id,
    createdAt: toIso(record.created_at),
    updatedAt: toIso(record.updated_at),
  };
}

export function toDomainFeedback(record: PrismaFeedback): Feedback {
  return {
    id: record.id,
    roundId: record.round_id,
    interviewerId: record.interviewer_id,
    technicalRating: record.technical_rating,
    communicationRating: record.communication_rating,
    problemSolvingRating: record.problem_solving_rating,
    cultureFitRating: record.culture_fit_rating,
    overallRating: record.overall_rating,
    strengthsText: record.strengths_text,
    improvementText: record.improvement_text,
    recommendation: record.recommendation,
    submittedAt: toIso(record.submitted_at),
  };
}

function toDomainRejection(record: PrismaRejectionReason): RejectionReason {
  return {
    id: record.id,
    candidateId: record.candidate_id,
    feedbackId: record.feedback_id,
    category: record.category,
    notes: record.notes,
    createdAt: toIso(record.created_at),
  };
}

export function toDomainRound(record: RoundWithRelations): InterviewRound {
  return {
    id: record.id,
    candidateId: record.candidate_id,
    roundNumber: record.round_number,
    roundType: record.round_type,
    interviewerId: record.interviewer_id,
    interviewerName: record.interviewer.full_name,
    scheduledAt: record.scheduled_at ? toIso(record.scheduled_at) : null,
    status: record.status,
    createdAt: toIso(record.created_at),
    updatedAt: toIso(record.updated_at),
    feedback: record.feedback ? toDomainFeedback(record.feedback) : null,
  };
}

export function toDomainCandidate(record: CandidateWithRelations): Candidate {
  return {
    id: record.id,
    fullName: record.full_name,
    email: record.email,
    phone: record.phone,
    currentRole: record.current_role,
    currentCompany: record.current_company,
    totalExperienceYrs: record.total_experience_yrs,
    skills: record.skills,
    resumeUrl: record.resume_url,
    resumeRawText: record.resume_raw_text,
    linkedinUrl: record.linkedin_url,
    source: record.source,
    currentStage: record.current_stage,
    stageUpdatedAt: toIso(record.updated_at),
    jobId: record.job_id,
    recruiterId: record.recruiter_id,
    notes: record.notes,
    createdAt: toIso(record.created_at),
    updatedAt: toIso(record.updated_at),
    rounds: record.interview_rounds.map(toDomainRound),
    rejection: record.rejection ? toDomainRejection(record.rejection) : null,
  };
}

export function toDomainSyncLog(record: PrismaSyncLog): SyncLog {
  return {
    id: record.id,
    candidateId: record.candidate_id,
    status: record.status,
    errorMessage: record.error_message,
    syncedAt: toIso(record.synced_at),
  };
}

export function toDomainCandidateFromPrisma(
  candidate: PrismaCandidate,
  rounds: InterviewRound[] = [],
  rejection: RejectionReason | null = null,
): Candidate {
  return {
    id: candidate.id,
    fullName: candidate.full_name,
    email: candidate.email,
    phone: candidate.phone,
    currentRole: candidate.current_role,
    currentCompany: candidate.current_company,
    totalExperienceYrs: candidate.total_experience_yrs,
    skills: candidate.skills,
    resumeUrl: candidate.resume_url,
    resumeRawText: candidate.resume_raw_text,
    linkedinUrl: candidate.linkedin_url,
    source: candidate.source,
    currentStage: candidate.current_stage,
    stageUpdatedAt: toIso(candidate.updated_at),
    jobId: candidate.job_id,
    recruiterId: candidate.recruiter_id,
    notes: candidate.notes,
    createdAt: toIso(candidate.created_at),
    updatedAt: toIso(candidate.updated_at),
    rounds,
    rejection,
  };
}

export function toDomainRoundFromPrisma(
  round: PrismaInterviewRound,
  interviewerName: string,
  feedback: Feedback | null = null,
): InterviewRound {
  return {
    id: round.id,
    candidateId: round.candidate_id,
    roundNumber: round.round_number,
    roundType: round.round_type,
    interviewerId: round.interviewer_id,
    interviewerName,
    scheduledAt: round.scheduled_at ? toIso(round.scheduled_at) : null,
    status: round.status,
    createdAt: toIso(round.created_at),
    updatedAt: toIso(round.updated_at),
    feedback,
  };
}
