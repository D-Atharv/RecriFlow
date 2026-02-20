export const USER_ROLES = ["ADMIN", "RECRUITER", "INTERVIEWER", "HIRING_MANAGER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const JOB_STATUSES = ["OPEN", "ON_HOLD", "CLOSED"] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export const CANDIDATE_SOURCES = [
  "LINKEDIN",
  "REFERRAL",
  "JOB_BOARD",
  "AGENCY",
  "DIRECT_APPLICATION",
  "OTHER",
] as const;
export type CandidateSource = (typeof CANDIDATE_SOURCES)[number];

export const PIPELINE_STAGES = [
  "APPLIED",
  "SCREENING",
  "TECHNICAL_L1",
  "TECHNICAL_L2",
  "SYSTEM_DESIGN",
  "HR",
  "OFFER",
  "HIRED",
  "REJECTED",
  "WITHDRAWN",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const ROUND_TYPES = [
  "SCREENING",
  "TECHNICAL_L1",
  "TECHNICAL_L2",
  "SYSTEM_DESIGN",
  "HR",
  "CULTURE_FIT",
  "FINAL",
] as const;
export type RoundType = (typeof ROUND_TYPES)[number];

export const ROUND_STATUSES = ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"] as const;
export type RoundStatus = (typeof ROUND_STATUSES)[number];

export const RECOMMENDATIONS = ["STRONG_YES", "YES", "NO", "STRONG_NO"] as const;
export type Recommendation = (typeof RECOMMENDATIONS)[number];

export const REJECTION_CATEGORIES = [
  "TECHNICAL_GAP",
  "COMMUNICATION",
  "EXPERIENCE_MISMATCH",
  "CULTURAL_FIT",
  "SALARY_EXPECTATIONS",
  "NOTICE_PERIOD",
  "NO_SHOW",
  "WITHDREW",
  "POSITION_CLOSED",
  "OTHER",
] as const;
export type RejectionCategory = (typeof REJECTION_CATEGORIES)[number];

export const SYNC_STATUSES = ["SUCCESS", "FAILED", "PENDING"] as const;
export type SyncStatus = (typeof SYNC_STATUSES)[number];

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requiredSkills: string[];
  experienceMin: number;
  experienceMax: number;
  status: JobStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  roundId: string;
  interviewerId: string;
  technicalRating: number;
  communicationRating: number;
  problemSolvingRating: number;
  cultureFitRating: number;
  overallRating: number;
  strengthsText: string;
  improvementText: string;
  recommendation: Recommendation;
  submittedAt: string;
}

export interface RejectionReason {
  id: string;
  candidateId: string;
  feedbackId: string;
  category: RejectionCategory;
  notes: string;
  createdAt: string;
}

export interface InterviewRound {
  id: string;
  candidateId: string;
  roundNumber: number;
  roundType: RoundType;
  interviewerId: string;
  interviewerName: string;
  scheduledAt: string | null;
  status: RoundStatus;
  createdAt: string;
  updatedAt: string;
  feedback: Feedback | null;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  currentRole: string | null;
  currentCompany: string | null;
  totalExperienceYrs: number | null;
  skills: string[];
  resumeUrl: string;
  resumeRawText: string;
  linkedinUrl: string | null;
  source: CandidateSource;
  currentStage: PipelineStage;
  stageUpdatedAt: string;
  jobId: string;
  recruiterId: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  rounds: InterviewRound[];
  rejection: RejectionReason | null;
}

export interface SyncLog {
  id: string;
  candidateId: string;
  status: SyncStatus;
  errorMessage: string | null;
  syncedAt: string;
}

export interface ParsedResumeData {
  full_name: string;
  email: string;
  phone: string;
  current_role: string;
  current_company: string;
  total_experience_yrs: number | null;
  skills: string[];
  raw_text: string;
}

export interface CreateCandidateInput {
  full_name: string;
  email: string;
  phone?: string;
  current_role?: string;
  current_company?: string;
  total_experience_yrs?: number;
  skills: string[];
  resume_url: string;
  resume_raw_text: string;
  linkedin_url?: string;
  source: CandidateSource;
  job_id: string;
  notes?: string;
}

export interface CandidateFilters {
  query?: string;
  stage?: PipelineStage;
  jobId?: string;
}

export interface CreateJobInput {
  title: string;
  department: string;
  description: string;
  required_skills: string[];
  experience_min: number;
  experience_max: number;
  status?: JobStatus;
}

export interface UpdateJobInput {
  title?: string;
  department?: string;
  description?: string;
  required_skills?: string[];
  experience_min?: number;
  experience_max?: number;
  status?: JobStatus;
}

export interface CreateRoundInput {
  round_number?: number;
  round_type: RoundType;
  interviewer_id: string;
  scheduled_at?: string | null;
}

export interface SubmitFeedbackInput {
  technical_rating: number;
  communication_rating: number;
  problem_solving_rating: number;
  culture_fit_rating: number;
  overall_rating: number;
  strengths_text: string;
  improvement_text: string;
  recommendation: Recommendation;
  rejection?: {
    category: RejectionCategory;
    notes: string;
  };
}

export interface RejectCandidateInput {
  category: RejectionCategory;
  notes: string;
}

export interface UpdateUserInput {
  role?: UserRole;
  is_active?: boolean;
}
