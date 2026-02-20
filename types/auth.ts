import type { UserRole } from "@/types/domain";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface AuthUserRecord {
  id: string;
  email: string;
  fullName: string;
  companyName?: string | null;
  role: UserRole;
  passwordHash: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  full_name: string;
  company_name: string;
  email: string;
  password: string;
}
