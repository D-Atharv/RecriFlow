import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { toDomainJob } from "@/server/repositories/mappers";
import type { Job } from "@/types/domain";

class JobsRepository {
  async list(): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return jobs.map(toDomainJob);
  }

  async listOpen(): Promise<Job[]> {
    const jobs = await prisma.job.findMany({
      where: {
        status: "OPEN",
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return jobs.map(toDomainJob);
  }

  async findById(id: string): Promise<Job | null> {
    const job = await prisma.job.findUnique({
      where: { id },
    });

    return job ? toDomainJob(job) : null;
  }

  async create(data: Job): Promise<Job> {
    const created = await prisma.job.create({
      data: {
        id: data.id,
        title: data.title,
        department: data.department,
        description: data.description,
        core_responsibilities: data.coreResponsibilities,
        interview_plan: data.interviewPlan as unknown as Prisma.InputJsonValue,
        required_skills: data.requiredSkills,
        experience_min: data.experienceMin,
        experience_max: data.experienceMax,
        status: data.status,
        created_by_id: data.createdById,
        created_at: new Date(data.createdAt),
        updated_at: new Date(data.updatedAt),
      },
    });

    return toDomainJob(created);
  }

  async update(id: string, patch: Partial<Job>): Promise<Job | null> {
    const data: Prisma.JobUpdateInput = {};

    if (patch.title !== undefined) {
      data.title = patch.title;
    }
    if (patch.department !== undefined) {
      data.department = patch.department;
    }
    if (patch.description !== undefined) {
      data.description = patch.description;
    }
    if (patch.coreResponsibilities !== undefined) {
      data.core_responsibilities = patch.coreResponsibilities;
    }
    if (patch.interviewPlan !== undefined) {
      data.interview_plan = patch.interviewPlan as unknown as Prisma.InputJsonValue;
    }
    if (patch.requiredSkills !== undefined) {
      data.required_skills = patch.requiredSkills;
    }
    if (patch.experienceMin !== undefined) {
      data.experience_min = patch.experienceMin;
    }
    if (patch.experienceMax !== undefined) {
      data.experience_max = patch.experienceMax;
    }
    if (patch.status !== undefined) {
      data.status = patch.status;
    }
    if (patch.createdById !== undefined) {
      data.created_by = {
        connect: {
          id: patch.createdById,
        },
      };
    }
    if (patch.createdAt !== undefined) {
      data.created_at = new Date(patch.createdAt);
    }
    if (patch.updatedAt !== undefined) {
      data.updated_at = new Date(patch.updatedAt);
    }

    if (Object.keys(data).length === 0) {
      return this.findById(id);
    }

    try {
      const updated = await prisma.job.update({
        where: { id },
        data,
      });

      return toDomainJob(updated);
    } catch (error) {
      if ((error as { code?: string }).code === "P2025") {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.job.delete({
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
}

export const jobsRepository = new JobsRepository();
