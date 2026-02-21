import type { SettingsSyncLogItem } from "@/components/settings/types";

export const syncStatusTone: Record<SettingsSyncLogItem["status"], string> = {
  SUCCESS: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-rose-100 text-rose-700",
  PENDING: "bg-amber-100 text-amber-700",
};

export function toReadableCategory(category: string): string {
  return category
    .toLowerCase()
    .split("_")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function toDateTime(value: string): string {
  return new Date(value).toLocaleString();
}
