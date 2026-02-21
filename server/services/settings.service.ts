import "server-only";

import type { SettingsRejectionItem, SettingsSyncLogItem } from "@/components/settings/types";
import { prisma } from "@/lib/prisma";

class SettingsService {
  async listSyncLogs(limit = 25): Promise<SettingsSyncLogItem[]> {
    const logs = await prisma.syncLog.findMany({
      take: limit,
      orderBy: {
        synced_at: "desc",
      },
      include: {
        candidate: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      candidateId: log.candidate.id,
      candidateName: log.candidate.full_name,
      status: log.status,
      errorMessage: log.error_message,
      syncedAt: log.synced_at.toISOString(),
    }));
  }

  async listRejections(limit = 25): Promise<SettingsRejectionItem[]> {
    const rejections = await prisma.rejectionReason.findMany({
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        candidate: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    return rejections.map((item) => ({
      id: item.id,
      candidateId: item.candidate.id,
      candidateName: item.candidate.full_name,
      category: item.category,
      notes: item.notes,
      createdAt: item.created_at.toISOString(),
    }));
  }
}

export const settingsService = new SettingsService();
