import "server-only";

import { NotFoundError, ValidationError } from "@/server/errors";
import { usersRepository } from "@/server/repositories/users.repository";
import { validateUpdateUserInput } from "@/server/validators/users.validator";
import type { SessionUser } from "@/types/auth";
import type { UpdateUserInput, User, UserRole } from "@/types/domain";

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
}

export const usersService = new UsersService();
