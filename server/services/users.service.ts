import "server-only";

import { hashPassword } from "@/server/auth/password";
import { ConflictError, NotFoundError, ValidationError } from "@/server/errors";
import { usersRepository } from "@/server/repositories/users.repository";
import { validateCreateUserInput, validateUpdateUserInput } from "@/server/validators/users.validator";
import type { SessionUser } from "@/types/auth";
import type { CreateUserInput, UpdateUserInput, User, UserRole } from "@/types/domain";

function toPublicUser(record: {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}): User {
  return {
    id: record.id,
    email: record.email,
    fullName: record.fullName,
    role: record.role,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

class UsersService {
  async listUsers(): Promise<User[]> {
    const users = await usersRepository.list();
    return users.map(toPublicUser);
  }

  async listInterviewers(): Promise<User[]> {
    const users = await usersRepository.list();
    return users
      .filter((user) => user.role === "INTERVIEWER" && user.isActive)
      .map(toPublicUser);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await usersRepository.findById(id);
    return user ? toPublicUser(user) : null;
  }

  async getUserByIdOrThrow(id: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async updateUser(id: string, payload: unknown, actor: SessionUser): Promise<User> {
    const existing = await usersRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("User not found");
    }

    const validation = validateUpdateUserInput(payload);
    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("User update validation failed", validation.issues);
    }

    const input: UpdateUserInput = validation.data;
    const nextRole = input.role ?? existing.role;
    const nextActive = input.is_active ?? existing.isActive;

    if (existing.id === actor.id && !nextActive) {
      throw new ValidationError("User update validation failed", {
        is_active: "You cannot deactivate your own account.",
      });
    }

    if (existing.id === actor.id && nextRole !== "ADMIN") {
      throw new ValidationError("User update validation failed", {
        role: "You cannot remove your own admin role.",
      });
    }

    const removingAdminPrivileges =
      existing.role === "ADMIN" && existing.isActive && (nextRole !== "ADMIN" || !nextActive);

    if (removingAdminPrivileges) {
      const activeAdminCount = await usersRepository.countActiveAdmins();
      if (activeAdminCount <= 1) {
        throw new ValidationError("User update validation failed", {
          role: "At least one active admin account is required.",
        });
      }
    }

    const updated = await usersRepository.update(existing.id, {
      role: input.role,
      isActive: input.is_active,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new NotFoundError("User not found");
    }

    return toPublicUser(updated);
  }

  async createUser(payload: unknown): Promise<User> {
    const validation = validateCreateUserInput(payload);

    if (Object.keys(validation.issues).length > 0) {
      throw new ValidationError("User create validation failed", validation.issues);
    }

    const input: CreateUserInput = validation.data;
    const existing = await usersRepository.findByEmail(input.email);

    if (existing) {
      throw new ConflictError("A user with this email already exists");
    }

    const now = new Date().toISOString();
    const created = await usersRepository.create({
      id: crypto.randomUUID(),
      fullName: input.full_name,
      companyName: input.company_name?.trim() ? input.company_name.trim() : null,
      email: input.email,
      passwordHash: hashPassword(input.password),
      role: input.role,
      isActive: input.is_active ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return toPublicUser(created);
  }

  async deleteUser(id: string, actor: SessionUser): Promise<void> {
    const existing = await usersRepository.findById(id);

    if (!existing) {
      throw new NotFoundError("User not found");
    }

    if (existing.id === actor.id) {
      throw new ValidationError("User remove validation failed", {
        user: "You cannot remove your own account.",
      });
    }

    if (existing.role === "ADMIN" && existing.isActive) {
      const activeAdminCount = await usersRepository.countActiveAdmins();

      if (activeAdminCount <= 1) {
        throw new ValidationError("User remove validation failed", {
          user: "At least one active admin account is required.",
        });
      }
    }

    try {
      const deleted = await usersRepository.delete(id);

      if (!deleted) {
        throw new NotFoundError("User not found");
      }
    } catch (error) {
      if ((error as { code?: string }).code === "P2003") {
        throw new ValidationError("User remove validation failed", {
          user: "User has related records. Deactivate the account instead of removing it.",
        });
      }

      throw error;
    }
  }
}

export const usersService = new UsersService();
