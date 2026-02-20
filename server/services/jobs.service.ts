import "server-only";

import { nowIso } from "@/lib/dates";
import { NotFoundError, ValidationError } from "@/server/errors";
import { jobsRepository } from "@/server/repositories/jobs.repository";
import { validateCreateJobInput, validateUpdateJobInput } from "@/server/validators/jobs.validator";
import type { CreateJobInput, Job, UpdateJobInput } from "@/types/domain";

class JobsService {
  async listJobs(): Promise<Job[]> {
    return jobsRepository.list();
  }

  async listOpenJobs(): Promise<Job[]> {
    return jobsRepository.listOpen();
  }

  async getJobById(id: string): Promise<Job | null> {
    return jobsRepository.findById(id);
  }

  async getJobByIdOrThrow(id: string): Promise<Job> {
    const job = await this.getJobById(id);

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    return job;
  }

  async createJob(payload: unknown, actorUserId: string): Promise<Job> {
    const validation = validateCreateJobInput(payload);

    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("Job validation failed", validation.issues);
    }

    const input: CreateJobInput = validation.data;
    const now = nowIso();

    return jobsRepository.create({
      id: crypto.randomUUID(),
      title: input.title,
      department: input.department,
      description: input.description,
      requiredSkills: input.required_skills,
      experienceMin: input.experience_min,
      experienceMax: input.experience_max,
      status: input.status ?? "OPEN",
      createdById: actorUserId,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateJob(id: string, payload: unknown): Promise<Job> {
    const existing = await this.getJobByIdOrThrow(id);
    const validation = validateUpdateJobInput(payload);

    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("Job validation failed", validation.issues);
    }

    const input: UpdateJobInput = validation.data;

    const updated = await jobsRepository.update(existing.id, {
      title: input.title ?? existing.title,
      department: input.department ?? existing.department,
      description: input.description ?? existing.description,
      requiredSkills: input.required_skills ?? existing.requiredSkills,
      experienceMin: input.experience_min ?? existing.experienceMin,
      experienceMax: input.experience_max ?? existing.experienceMax,
      status: input.status ?? existing.status,
      updatedAt: nowIso(),
    });

    if (!updated) {
      throw new NotFoundError("Job not found");
    }

    return updated;
  }

  async deleteJob(id: string): Promise<void> {
    const deleted = await jobsRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError("Job not found");
    }
  }
}

export const jobsService = new JobsService();
