import "server-only";

import { ConflictError, UnauthorizedError, ValidationError } from "@/server/errors";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { usersRepository } from "@/server/repositories/users.repository";
import { validateLoginInput, validateRegisterInput } from "@/server/validators/auth.validator";
import type { SessionUser } from "@/types/auth";

function toSessionUser(user: {
  id: string;
  email: string;
  fullName: string;
  role: SessionUser["role"];
}): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}

class AuthService {
  async register(payload: unknown): Promise<SessionUser> {
    const validation = validateRegisterInput(payload);

    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("Registration validation failed", validation.issues);
    }

    const input = validation.data;

    if (await usersRepository.findByEmail(input.email)) {
      throw new ConflictError("An account with this email already exists");
    }

    const now = new Date().toISOString();

    const created = await usersRepository.create({
      id: crypto.randomUUID(),
      fullName: input.full_name,
      companyName: input.company_name,
      email: input.email,
      role: "RECRUITER",
      passwordHash: hashPassword(input.password),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return toSessionUser(created);
  }

  async login(payload: unknown): Promise<SessionUser> {
    const validation = validateLoginInput(payload);

    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("Login validation failed", validation.issues);
    }

    const input = validation.data;
    const user = await usersRepository.findByEmail(input.email);

    if (!user || !user.isActive || !verifyPassword(input.password, user.passwordHash)) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return toSessionUser(user);
  }
}

export const authService = new AuthService();
