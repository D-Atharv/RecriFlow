import type { CandidateSource } from "@/types/domain";

export interface CandidateWizardValues {
    full_name: string;
    email: string;
    phone: string;
    current_role: string;
    current_company: string;
    total_experience_yrs: string;
    skills: string[];
    resume_url: string;
    resume_raw_text: string;
    linkedin_url: string;
    portfolio_url: string;
    source: CandidateSource;
    job_id: string;
    notes: string;
    assessment_notes: string;
    skill_proficiency: number;
    work_authorization: boolean;
    meets_experience: boolean;
    pipeline_stage: "APPLIED" | "SCREENING" | "TECHNICAL_L1";
    manager_notes: string;
}
