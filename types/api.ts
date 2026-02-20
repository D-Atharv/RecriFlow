import type { Candidate, InterviewRound, Job, ParsedResumeData, User } from "@/types/domain";
import type { SessionUser } from "@/types/auth";

export interface ErrorResponse {
  error: string;
  issues?: Record<string, string>;
}

export interface UploadResumeResponse {
  resume_url: string;
  parsed: ParsedResumeData | null;
  parse_failed: boolean;
}

export interface CandidateListResponse {
  candidates: Candidate[];
}

export interface CandidateResponse {
  candidate: Candidate;
}

export interface JobsResponse {
  jobs: Job[];
}

export interface JobResponse {
  job: Job;
}

export interface InterviewRoundsResponse {
  rounds: InterviewRound[];
}

export interface InterviewRoundResponse {
  round: InterviewRound;
}

export interface UsersResponse {
  users: User[];
}

export interface SessionResponse {
  user: SessionUser | null;
}

export interface AuthResponse {
  user: SessionUser;
}
