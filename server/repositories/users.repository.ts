import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { toAuthUserRecord } from "@/server/repositories/mappers";
import type { AuthUserRecord } from "@/types/auth";

class UsersRepository {
  async list(): Promise<AuthUserRecord[]> {
    const users = await prisma.user.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    return users.map(toAuthUserRecord);
  }

  async countActiveAdmins(): Promise<number> {
    return prisma.user.count({
      where: {
        role: "ADMIN",
        is_active: true,
      },
    });
  }

  async findById(id: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? toAuthUserRecord(user) : null;
  }

  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    return user ? toAuthUserRecord(user) : null;
  }

  async create(data: AuthUserRecord): Promise<AuthUserRecord> {
    const created = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email.toLowerCase(),
        full_name: data.fullName,
        company_name: data.companyName,
        password_hash: data.passwordHash,
        role: data.role,
        is_active: data.isActive,
        created_at: new Date(data.createdAt),
        updated_at: new Date(data.updatedAt),
      },
    });

    return toAuthUserRecord(created);
  }

  async update(id: string, patch: Partial<AuthUserRecord>): Promise<AuthUserRecord | null> {
    const data: Prisma.UserUpdateInput = {};

    if (patch.email !== undefined) {
      data.email = patch.email.toLowerCase();
    }
    if (patch.fullName !== undefined) {
      data.full_name = patch.fullName;
    }
    if (patch.companyName !== undefined) {
      data.company_name = patch.companyName;
    }
    if (patch.passwordHash !== undefined) {
      data.password_hash = patch.passwordHash;
    }
    if (patch.role !== undefined) {
      data.role = patch.role;
    }
    if (patch.isActive !== undefined) {
      data.is_active = patch.isActive;
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
      const updated = await prisma.user.update({
        where: { id },
        data,
      });

      return toAuthUserRecord(updated);
    } catch (error) {
      if ((error as { code?: string }).code === "P2025") {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
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

export const usersRepository = new UsersRepository();
