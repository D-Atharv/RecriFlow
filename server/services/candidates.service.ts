import "server-only";

import { prisma } from "@/lib/prisma";
import { sendCandidateRejectedEmail, sendFeedbackSubmittedEmail, sendInterviewerAssignmentEmail } from "@/lib/email";
import { syncCandidateToSheets } from "@/lib/sheets";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import { candidateWithRelationsArgs, roundWithRelationsArgs, toDomainCandidate, toDomainFeedback, toDomainRound } from "@/server/repositories/mappers";
import { jobsRepository } from "@/server/repositories/jobs.repository";
import { usersRepository } from "@/server/repositories/users.repository";
import { validateCreateCandidateInput } from "@/server/validators/candidates.validator";
import { validateCreateRoundInput, validateSubmitFeedbackInput } from "@/server/validators/rounds.validator";
import type { SessionUser } from "@/types/auth";
import type {
  Candidate,
  CandidateFilters,
  Feedback,
  InterviewRound,
  PipelineStage,
  RejectCandidateInput,
  RoundType,
} from "@/types/domain";
import { RejectCandidateSchema } from "@/types/schemas";

const ROUND_STAGE_MAP: Record<RoundType, PipelineStage> = {
  SCREENING: "SCREENING",
  TECHNICAL_L1: "TECHNICAL_L1",
  TECHNICAL_L2: "TECHNICAL_L2",
  SYSTEM_DESIGN: "SYSTEM_DESIGN",
  HR: "HR",
  CULTURE_FIT: "HR",
  FINAL: "OFFER",
};

function roundTypeToStage(roundType: RoundType): PipelineStage {
  return ROUND_STAGE_MAP[roundType];
}

function filterByQuery(candidate: Candidate, query: string): boolean {
  const lowered = query.toLowerCase();

  return [
    candidate.fullName,
    candidate.email,
    candidate.currentRole ?? "",
    candidate.currentCompany ?? "",
    candidate.skills.join(" "),
  ]
    .join(" ")
    .toLowerCase()
    .includes(lowered);
}

function ensureCanManageCandidates(user: SessionUser): void {
  if (!["ADMIN", "RECRUITER"].includes(user.role)) {
    throw new ForbiddenError("Only admins and recruiters can manage candidate workflows");
  }
}

function ensureCanEditCandidateNotes(user: SessionUser): void {
  if (!["ADMIN", "RECRUITER", "HIRING_MANAGER"].includes(user.role)) {
    throw new ForbiddenError("You do not have access to edit candidate notes");
  }
}

class CandidatesService {
  async listCandidates(filters: CandidateFilters = {}): Promise<Candidate[]> {
    const records = await prisma.candidate.findMany({
      ...candidateWithRelationsArgs,
      orderBy: {
        created_at: "desc",
      },
    });

    return records
      .map(toDomainCandidate)
      .filter((candidate: Candidate) => {
        if (filters.query && !filterByQuery(candidate, filters.query)) {
          return false;
        }

        if (filters.stage && candidate.currentStage !== filters.stage) {
          return false;
        }

        if (filters.jobId && candidate.jobId !== filters.jobId) {
          return false;
        }

        return true;
      });
  }

  async getCandidateById(id: string): Promise<Candidate | null> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      ...candidateWithRelationsArgs,
    });

    return candidate ? toDomainCandidate(candidate) : null;
  }

  async getCandidateByIdOrThrow(id: string): Promise<Candidate> {
    const candidate = await this.getCandidateById(id);

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    return candidate;
  }

  async createCandidate(payload: unknown, actor: SessionUser): Promise<Candidate> {
    ensureCanManageCandidates(actor);

    const validation = validateCreateCandidateInput(payload);
    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("Candidate validation failed", validation.issues);
    }

    const input = validation.data;

    const existing = await prisma.candidate.findUnique({
      where: {
        email: input.email.toLowerCase(),
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      throw new ConflictError("A candidate with this email already exists", {
        existing_id: existing.id,
      });
    }

    const job = await jobsRepository.findById(input.job_id);
    if (!job) {
      throw new ValidationError("Candidate validation failed", {
        job_id: "Assigned job does not exist.",
      });
    }

    const created = await prisma.candidate.create({
      data: {
        id: crypto.randomUUID(),
        full_name: input.full_name,
        email: input.email.toLowerCase(),
        phone: input.phone ?? null,
        current_role: input.current_role ?? null,
        current_company: input.current_company ?? null,
        total_experience_yrs: input.total_experience_yrs ?? null,
        skills: input.skills,
        resume_url: input.resume_url,
        resume_raw_text: input.resume_raw_text,
        linkedin_url: input.linkedin_url ?? null,
        source: input.source,
        current_stage: input.current_stage ?? "APPLIED",
        job_id: input.job_id,
        recruiter_id: actor.id,
        notes: input.notes ?? null,
      },
      ...candidateWithRelationsArgs,
    });

    syncCandidateToSheets(created.id).catch((error) => {
      console.error("Candidate sheets sync failed", error);
    });

    return toDomainCandidate(created);
  }

  async updateCandidateStage(id: string, stage: PipelineStage, actor: SessionUser): Promise<Candidate> {
    ensureCanManageCandidates(actor);

    await this.getCandidateByIdOrThrow(id);

    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        current_stage: stage,
        updated_at: new Date(),
      },
      ...candidateWithRelationsArgs,
    });

    syncCandidateToSheets(updated.id).catch((error) => {
      console.error("Candidate stage sync failed", error);
    });

    return toDomainCandidate(updated);
  }

  async updateCandidateNotes(id: string, notes: string | null, actor: SessionUser): Promise<Candidate> {
    ensureCanEditCandidateNotes(actor);

    await this.getCandidateByIdOrThrow(id);

    const updated = await prisma.candidate.update({
      where: { id },
      data: {
        notes,
        updated_at: new Date(),
      },
      ...candidateWithRelationsArgs,
    });

    syncCandidateToSheets(updated.id).catch((error) => {
      console.error("Candidate notes sync failed", error);
    });

    return toDomainCandidate(updated);
  }

  async deleteCandidate(id: string, actor: SessionUser): Promise<void> {
    ensureCanManageCandidates(actor);

    try {
      await prisma.candidate.delete({
        where: { id },
      });
    } catch (error) {
      if ((error as { code?: string }).code === "P2025") {
        throw new NotFoundError("Candidate not found");
      }

      throw error;
    }
  }

  async listRounds(candidateId: string): Promise<InterviewRound[]> {
    return (await this.getCandidateByIdOrThrow(candidateId)).rounds;
  }

  async createRound(candidateId: string, payload: unknown, actor: SessionUser): Promise<InterviewRound> {
    if (!["ADMIN", "RECRUITER", "INTERVIEWER", "HIRING_MANAGER"].includes(actor.role)) {
      throw new ForbiddenError("You do not have permission to create interview rounds");
    }

    const validation = validateCreateRoundInput(payload);
    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("Round validation failed", validation.issues);
    }

    const input = validation.data;

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        job: true,
        interview_rounds: {
          select: {
            round_number: true,
          },
        },
      },
    });

    if (!candidate) {
      throw new NotFoundError("Candidate not found");
    }

    const interviewer = await usersRepository.findById(input.interviewer_id);
    if (!interviewer || !interviewer.isActive) {
      throw new ValidationError("Round validation failed", {
        interviewer_id: "Assigned interviewer is invalid.",
      });
    }

    const roundNumber =
      input.round_number ??
      (candidate.interview_rounds.length
        ? Math.max(...candidate.interview_rounds.map((round) => round.round_number)) + 1
        : 1);

    const existing = await prisma.interviewRound.findUnique({
      where: {
        candidate_id_round_number: {
          candidate_id: candidateId,
          round_number: roundNumber,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      throw new ConflictError("Round number already exists for this candidate");
    }

    const round = await prisma.$transaction(async (tx) => {
      const created = await tx.interviewRound.create({
        data: {
          id: crypto.randomUUID(),
          candidate_id: candidateId,
          round_number: roundNumber,
          round_type: input.round_type,
          interviewer_id: interviewer.id,
          scheduled_at: input.scheduled_at ? new Date(input.scheduled_at) : null,
          status: "SCHEDULED",
        },
        ...roundWithRelationsArgs,
      });

      await tx.candidate.update({
        where: { id: candidateId },
        data: {
          current_stage: roundTypeToStage(input.round_type),
          updated_at: new Date(),
        },
      });

      return created;
    });

    sendInterviewerAssignmentEmail({
      interviewerEmail: interviewer.email,
      interviewerName: interviewer.fullName,
      candidateName: candidate.full_name,
      roundType: round.round_type,
      scheduledAt: round.scheduled_at ? round.scheduled_at.toISOString() : null,
      feedbackUrl: `/candidates/${candidate.id}/rounds/${round.id}/feedback`,
    }).catch((error) => {
      console.error("Interviewer assignment email failed", error);
    });

    syncCandidateToSheets(candidate.id).catch((error) => {
      console.error("Round sync failed", error);
    });

    return toDomainRound(round);
  }

  async submitFeedback(candidateId: string, roundId: string, payload: unknown, actor: SessionUser): Promise<Feedback> {
    const validation = validateSubmitFeedbackInput(payload);
    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("Feedback validation failed", validation.issues);
    }

    const data = validation.data;

    const round = await prisma.interviewRound.findUnique({
      where: { id: roundId },
      include: {
        feedback: true,
        candidate: true,
      },
    });

    if (!round || round.candidate_id !== candidateId) {
      throw new NotFoundError("Interview round not found");
    }

    if (round.feedback) {
      throw new ConflictError("Feedback has already been submitted for this round");
    }

    const isInterviewer = actor.id === round.interviewer_id;
    if (!isInterviewer && actor.role !== "ADMIN") {
      throw new ForbiddenError("You are not assigned to this interview round");
    }

    const isRejection = ["NO", "STRONG_NO"].includes(data.recommendation);
    if (isRejection && (!data.rejection || data.rejection.notes.length < 20)) {
      throw new ValidationError("Feedback validation failed", {
        rejection: "Rejection category and at least 20 characters of notes are required.",
      });
    }

    const feedback = await prisma.$transaction(async (tx) => {
      const created = await tx.feedback.create({
        data: {
          id: crypto.randomUUID(),
          round_id: roundId,
          interviewer_id: actor.id,
          technical_rating: data.technical_rating,
          communication_rating: data.communication_rating,
          problem_solving_rating: data.problem_solving_rating,
          culture_fit_rating: data.culture_fit_rating,
          overall_rating: data.overall_rating,
          strengths_text: data.strengths_text,
          improvement_text: data.improvement_text,
          recommendation: data.recommendation,
          submitted_at: new Date(),
        },
      });

      await tx.interviewRound.update({
        where: { id: roundId },
        data: {
          status: "COMPLETED",
          updated_at: new Date(),
        },
      });

      if (isRejection && data.rejection) {
        await tx.rejectionReason.upsert({
          where: {
            candidate_id: candidateId,
          },
          update: {
            feedback_id: created.id,
            category: data.rejection.category,
            notes: data.rejection.notes,
          },
          create: {
            id: crypto.randomUUID(),
            candidate_id: candidateId,
            feedback_id: created.id,
            category: data.rejection.category,
            notes: data.rejection.notes,
            created_at: new Date(),
          },
        });

        await tx.candidate.update({
          where: { id: candidateId },
          data: {
            current_stage: "REJECTED",
            updated_at: new Date(),
          },
        });
      }

      return created;
    });

    const recruiter = await usersRepository.findById(round.candidate.recruiter_id);
    if (recruiter) {
      sendFeedbackSubmittedEmail({
        recruiterEmail: recruiter.email,
        recruiterName: recruiter.fullName,
        candidateName: round.candidate.full_name,
        roundType: round.round_type,
        overallRating: feedback.overall_rating,
        recommendation: feedback.recommendation,
      }).catch((error) => {
        console.error("Feedback notification email failed", error);
      });

      if (isRejection && data.rejection) {
        sendCandidateRejectedEmail({
          recruiterEmail: recruiter.email,
          recruiterName: recruiter.fullName,
          candidateName: round.candidate.full_name,
          category: data.rejection.category,
          notes: data.rejection.notes,
        }).catch((error) => {
          console.error("Candidate rejection email failed", error);
        });
      }
    }

    syncCandidateToSheets(candidateId).catch((error) => {
      console.error("Feedback sync failed", error);
    });

    return toDomainFeedback(feedback);
  }

  async rejectCandidate(candidateId: string, payload: RejectCandidateInput, actor: SessionUser): Promise<Candidate> {
    ensureCanManageCandidates(actor);

    const parsed = RejectCandidateSchema.safeParse(payload);
    if (!parsed.success) {
      const issues = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join("."), issue.message]));
      throw new ValidationError("Candidate rejection failed", issues);
    }

    const safePayload = parsed.data;
    const candidate = await this.getCandidateByIdOrThrow(candidateId);

    await prisma.$transaction(async (tx) => {
      let feedbackId = candidate.rejection?.feedbackId;

      if (!feedbackId) {
        const latestRound = await tx.interviewRound.findFirst({
          where: { candidate_id: candidateId },
          orderBy: { round_number: "desc" },
          include: { feedback: true },
        });

        if (latestRound?.feedback) {
          feedbackId = latestRound.feedback.id;
        } else {
          const now = new Date();
          const roundNumber = latestRound ? latestRound.round_number + 1 : 1;

          const syntheticRound = await tx.interviewRound.create({
            data: {
              id: crypto.randomUUID(),
              candidate_id: candidateId,
              round_number: roundNumber,
              round_type: "HR",
              interviewer_id: actor.id,
              scheduled_at: now,
              status: "COMPLETED",
            },
          });

          const syntheticFeedback = await tx.feedback.create({
            data: {
              id: crypto.randomUUID(),
              round_id: syntheticRound.id,
              interviewer_id: actor.id,
              technical_rating: 1,
              communication_rating: 1,
              problem_solving_rating: 1,
              culture_fit_rating: 1,
              overall_rating: 1,
              strengths_text: "Manual rejection closure.",
              improvement_text: "Rejected before full interview completion.",
              recommendation: "NO",
              submitted_at: now,
            },
          });

          feedbackId = syntheticFeedback.id;
        }
      }

      await tx.rejectionReason.upsert({
        where: {
          candidate_id: candidateId,
        },
        update: {
          feedback_id: feedbackId,
          category: safePayload.category,
          notes: safePayload.notes.trim(),
        },
        create: {
          id: crypto.randomUUID(),
          candidate_id: candidateId,
          feedback_id: feedbackId,
          category: safePayload.category,
          notes: safePayload.notes.trim(),
          created_at: new Date(),
        },
      });

      await tx.candidate.update({
        where: { id: candidateId },
        data: {
          current_stage: "REJECTED",
          updated_at: new Date(),
        },
      });
    });

    syncCandidateToSheets(candidateId).catch((error) => {
      console.error("Reject sync failed", error);
    });

    return this.getCandidateByIdOrThrow(candidateId);
  }
}

export const candidatesService = new CandidatesService();
