import { pbkdf2Sync, randomBytes } from "node:crypto";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ITERATIONS = 120_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return `${ITERATIONS}.${salt}.${hash}`;
}

async function main(): Promise<void> {
  const now = new Date();

  const admin = await prisma.user.upsert({
    where: { email: "admin@talentlens.local" },
    update: {
      full_name: "Aarav Admin",
      role: "ADMIN",
      is_active: true,
      password_hash: hashPassword("Admin@12345"),
      updated_at: now,
    },
    create: {
      email: "admin@talentlens.local",
      full_name: "Aarav Admin",
      role: "ADMIN",
      is_active: true,
      password_hash: hashPassword("Admin@12345"),
    },
  });

  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@talentlens.local" },
    update: {
      full_name: "Riya Recruiter",
      role: "RECRUITER",
      is_active: true,
      password_hash: hashPassword("Recruiter@123"),
      updated_at: now,
    },
    create: {
      email: "recruiter@talentlens.local",
      full_name: "Riya Recruiter",
      role: "RECRUITER",
      is_active: true,
      password_hash: hashPassword("Recruiter@123"),
    },
  });

  const interviewer1 = await prisma.user.upsert({
    where: { email: "interviewer1@talentlens.local" },
    update: {
      full_name: "Kavya Nair",
      role: "INTERVIEWER",
      is_active: true,
      password_hash: hashPassword("Interviewer@123"),
      updated_at: now,
    },
    create: {
      email: "interviewer1@talentlens.local",
      full_name: "Kavya Nair",
      role: "INTERVIEWER",
      is_active: true,
      password_hash: hashPassword("Interviewer@123"),
    },
  });

  await prisma.user.upsert({
    where: { email: "interviewer2@talentlens.local" },
    update: {
      full_name: "Rahul Verma",
      role: "INTERVIEWER",
      is_active: true,
      password_hash: hashPassword("Interviewer@123"),
      updated_at: now,
    },
    create: {
      email: "interviewer2@talentlens.local",
      full_name: "Rahul Verma",
      role: "INTERVIEWER",
      is_active: true,
      password_hash: hashPassword("Interviewer@123"),
    },
  });

  await prisma.user.upsert({
    where: { email: "hm@talentlens.local" },
    update: {
      full_name: "Maya Singh",
      role: "HIRING_MANAGER",
      is_active: true,
      password_hash: hashPassword("Manager@123"),
      updated_at: now,
    },
    create: {
      email: "hm@talentlens.local",
      full_name: "Maya Singh",
      role: "HIRING_MANAGER",
      is_active: true,
      password_hash: hashPassword("Manager@123"),
    },
  });

  const frontendJob = await prisma.job.upsert({
    where: { id: "job-frontend-001" },
    update: {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      description: "Own core frontend architecture and mentor engineers.",
      required_skills: ["React", "Next.js", "TypeScript", "Testing"],
      experience_min: 4,
      experience_max: 8,
      status: "OPEN",
      created_by_id: admin.id,
      updated_at: now,
    },
    create: {
      id: "job-frontend-001",
      title: "Senior Frontend Engineer",
      department: "Engineering",
      description: "Own core frontend architecture and mentor engineers.",
      required_skills: ["React", "Next.js", "TypeScript", "Testing"],
      experience_min: 4,
      experience_max: 8,
      status: "OPEN",
      created_by_id: admin.id,
    },
  });

  const backendJob = await prisma.job.upsert({
    where: { id: "job-backend-001" },
    update: {
      title: "Backend Engineer",
      department: "Engineering",
      description: "Design resilient APIs and improve platform performance.",
      required_skills: ["Node.js", "PostgreSQL", "System Design"],
      experience_min: 3,
      experience_max: 7,
      status: "OPEN",
      created_by_id: admin.id,
      updated_at: now,
    },
    create: {
      id: "job-backend-001",
      title: "Backend Engineer",
      department: "Engineering",
      description: "Design resilient APIs and improve platform performance.",
      required_skills: ["Node.js", "PostgreSQL", "System Design"],
      experience_min: 3,
      experience_max: 7,
      status: "OPEN",
      created_by_id: admin.id,
    },
  });

  await prisma.job.upsert({
    where: { id: "job-devops-001" },
    update: {
      title: "DevOps Engineer",
      department: "Platform",
      description: "Scale CI/CD and cloud operations for product teams.",
      required_skills: ["Docker", "Kubernetes", "Terraform"],
      experience_min: 3,
      experience_max: 6,
      status: "OPEN",
      created_by_id: admin.id,
      updated_at: now,
    },
    create: {
      id: "job-devops-001",
      title: "DevOps Engineer",
      department: "Platform",
      description: "Scale CI/CD and cloud operations for product teams.",
      required_skills: ["Docker", "Kubernetes", "Terraform"],
      experience_min: 3,
      experience_max: 6,
      status: "OPEN",
      created_by_id: admin.id,
    },
  });

  const candidate = await prisma.candidate.upsert({
    where: { email: "priya.sharma@example.com" },
    update: {
      full_name: "Priya Sharma",
      phone: "+91 9876543210",
      current_role: "Senior Frontend Developer",
      current_company: "Infosys",
      total_experience_yrs: 4.5,
      skills: ["React", "TypeScript", "Next.js", "CSS"],
      resume_url: "https://example.com/resumes/priya-sharma.pdf",
      resume_raw_text: "Experienced frontend engineer with React and TypeScript.",
      linkedin_url: "https://linkedin.com/in/priya-sharma",
      source: "LINKEDIN",
      current_stage: "TECHNICAL_L1",
      job_id: frontendJob.id,
      recruiter_id: recruiter.id,
      notes: "Strong UI architecture background.",
      updated_at: now,
    },
    create: {
      email: "priya.sharma@example.com",
      full_name: "Priya Sharma",
      phone: "+91 9876543210",
      current_role: "Senior Frontend Developer",
      current_company: "Infosys",
      total_experience_yrs: 4.5,
      skills: ["React", "TypeScript", "Next.js", "CSS"],
      resume_url: "https://example.com/resumes/priya-sharma.pdf",
      resume_raw_text: "Experienced frontend engineer with React and TypeScript.",
      linkedin_url: "https://linkedin.com/in/priya-sharma",
      source: "LINKEDIN",
      current_stage: "TECHNICAL_L1",
      job_id: frontendJob.id,
      recruiter_id: recruiter.id,
      notes: "Strong UI architecture background.",
    },
  });

  const round = await prisma.interviewRound.upsert({
    where: {
      candidate_id_round_number: {
        candidate_id: candidate.id,
        round_number: 1,
      },
    },
    update: {
      round_type: "SCREENING",
      interviewer_id: interviewer1.id,
      status: "COMPLETED",
      updated_at: now,
    },
    create: {
      candidate_id: candidate.id,
      round_number: 1,
      round_type: "SCREENING",
      interviewer_id: interviewer1.id,
      status: "COMPLETED",
    },
  });

  await prisma.feedback.upsert({
    where: { round_id: round.id },
    update: {
      interviewer_id: interviewer1.id,
      technical_rating: 4,
      communication_rating: 4,
      problem_solving_rating: 4,
      culture_fit_rating: 5,
      overall_rating: 4,
      strengths_text: "Structured thought process and strong React foundations.",
      improvement_text: "Could improve API error-handling examples.",
      recommendation: "YES",
      submitted_at: now,
    },
    create: {
      round_id: round.id,
      interviewer_id: interviewer1.id,
      technical_rating: 4,
      communication_rating: 4,
      problem_solving_rating: 4,
      culture_fit_rating: 5,
      overall_rating: 4,
      strengths_text: "Structured thought process and strong React foundations.",
      improvement_text: "Could improve API error-handling examples.",
      recommendation: "YES",
      submitted_at: now,
    },
  });

  await prisma.candidate.upsert({
    where: { email: "arjun.menon@example.com" },
    update: {
      full_name: "Arjun Menon",
      phone: "+91 9988776655",
      current_role: "Backend Engineer",
      current_company: "TCS",
      total_experience_yrs: 6,
      skills: ["Node.js", "PostgreSQL", "Redis", "Docker"],
      resume_url: "https://example.com/resumes/arjun-menon.pdf",
      resume_raw_text: "Backend engineer with distributed systems focus.",
      linkedin_url: "https://linkedin.com/in/arjun-menon",
      source: "REFERRAL",
      current_stage: "SCREENING",
      job_id: backendJob.id,
      recruiter_id: recruiter.id,
      updated_at: now,
    },
    create: {
      email: "arjun.menon@example.com",
      full_name: "Arjun Menon",
      phone: "+91 9988776655",
      current_role: "Backend Engineer",
      current_company: "TCS",
      total_experience_yrs: 6,
      skills: ["Node.js", "PostgreSQL", "Redis", "Docker"],
      resume_url: "https://example.com/resumes/arjun-menon.pdf",
      resume_raw_text: "Backend engineer with distributed systems focus.",
      linkedin_url: "https://linkedin.com/in/arjun-menon",
      source: "REFERRAL",
      current_stage: "SCREENING",
      job_id: backendJob.id,
      recruiter_id: recruiter.id,
    },
  });

  console.info("Prisma seed completed.");
}

main()
  .catch((error) => {
    console.error("Prisma seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
