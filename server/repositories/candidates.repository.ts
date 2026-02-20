import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { candidateWithRelationsArgs, toDomainCandidate, toDomainSyncLog } from "@/server/repositories/mappers";
import type { Candidate, SyncLog } from "@/types/domain";

class CandidatesRepository {
  async list(): Promise<Candidate[]> {
    const candidates = await prisma.candidate.findMany({
      ...candidateWithRelationsArgs,
      orderBy: {
        created_at: "desc",
      },
    });

    return candidates.map(toDomainCandidate);
  }

  async findById(id: string): Promise<Candidate | null> {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      ...candidateWithRelationsArgs,
    });

    return candidate ? toDomainCandidate(candidate) : null;
  }

  async findByEmail(email: string): Promise<Candidate | null> {
    const candidate = await prisma.candidate.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      ...candidateWithRelationsArgs,
    });

    return candidate ? toDomainCandidate(candidate) : null;
  }

  async create(data: Candidate): Promise<Candidate> {
    const created = await prisma.candidate.create({
      data: {
        id: data.id,
        full_name: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        current_role: data.currentRole,
        current_company: data.currentCompany,
        total_experience_yrs: data.totalExperienceYrs,
        skills: data.skills,
        resume_url: data.resumeUrl,
        resume_raw_text: data.resumeRawText,
        linkedin_url: data.linkedinUrl,
        source: data.source,
        current_stage: data.currentStage,
        job_id: data.jobId,
        recruiter_id: data.recruiterId,
        notes: data.notes,
        created_at: new Date(data.createdAt),
        updated_at: new Date(data.updatedAt),
      },
      ...candidateWithRelationsArgs,
    });

    return toDomainCandidate(created);
  }

  async update(id: string, patch: Partial<Candidate>): Promise<Candidate | null> {
    const data: Prisma.CandidateUpdateInput = {};

    if (patch.fullName !== undefined) {
      data.full_name = patch.fullName;
    }
    if (patch.email !== undefined) {
      data.email = patch.email.toLowerCase();
    }
    if (patch.phone !== undefined) {
      data.phone = patch.phone;
    }
    if (patch.currentRole !== undefined) {
      data.current_role = patch.currentRole;
    }
    if (patch.currentCompany !== undefined) {
      data.current_company = patch.currentCompany;
    }
    if (patch.totalExperienceYrs !== undefined) {
      data.total_experience_yrs = patch.totalExperienceYrs;
    }
    if (patch.skills !== undefined) {
      data.skills = patch.skills;
    }
    if (patch.resumeUrl !== undefined) {
      data.resume_url = patch.resumeUrl;
    }
    if (patch.resumeRawText !== undefined) {
      data.resume_raw_text = patch.resumeRawText;
    }
    if (patch.linkedinUrl !== undefined) {
      data.linkedin_url = patch.linkedinUrl;
    }
    if (patch.source !== undefined) {
      data.source = patch.source;
    }
    if (patch.currentStage !== undefined) {
      data.current_stage = patch.currentStage;
    }
    if (patch.jobId !== undefined) {
      data.job = {
        connect: {
          id: patch.jobId,
        },
      };
    }
    if (patch.recruiterId !== undefined) {
      data.recruiter = {
        connect: {
          id: patch.recruiterId,
        },
      };
    }
    if (patch.notes !== undefined) {
      data.notes = patch.notes;
    }
    if (patch.updatedAt !== undefined) {
      data.updated_at = new Date(patch.updatedAt);
    }

    if (Object.keys(data).length === 0) {
      return this.findById(id);
    }

    try {
      const updated = await prisma.candidate.update({
        where: { id },
        data,
        ...candidateWithRelationsArgs,
      });

      return toDomainCandidate(updated);
    } catch (error) {
      if ((error as { code?: string }).code === "P2025") {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.candidate.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === "P2025") {
        return false;
      }
      throw error;
    }
  }

  async createSyncLog(log: SyncLog): Promise<SyncLog> {
    const created = await prisma.syncLog.create({
      data: {
        id: log.id,
        candidate_id: log.candidateId,
        status: log.status,
        error_message: log.errorMessage,
        synced_at: new Date(log.syncedAt),
      },
    });

    return toDomainSyncLog(created);
  }

  async listSyncLogs(candidateId?: string): Promise<SyncLog[]> {
    const logs = await prisma.syncLog.findMany({
      where: candidateId ? { candidate_id: candidateId } : undefined,
      orderBy: {
        synced_at: "desc",
      },
    });

    return logs.map(toDomainSyncLog);
  }
}

export const candidatesRepository = new CandidatesRepository();
