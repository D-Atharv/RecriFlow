import { STORAGE_OBJECT_PREFIX, STORAGE_ROUTE_PREFIX } from "@/lib/storage/constants";

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

function buildDatePath(now: Date): string {
  const year = now.getUTCFullYear();
  const month = pad2(now.getUTCMonth() + 1);
  const day = pad2(now.getUTCDate());

  return `${year}/${month}/${day}`;
}

function inferExtension(file: File): string {
  if (file.type === "application/pdf") {
    return "pdf";
  }

  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return "docx";
  }

  const fromName = file.name.split(".").pop()?.toLowerCase();
  return fromName || "bin";
}

export function buildResumeObjectKey(file: File, now = new Date()): string {
  const extension = inferExtension(file);
  const datePath = buildDatePath(now);
  return `${STORAGE_OBJECT_PREFIX}/${datePath}/${crypto.randomUUID()}.${extension}`;
}

export function toFileRoute(objectKey: string): string {
  return `${STORAGE_ROUTE_PREFIX}/${encodeURIComponent(objectKey)}`;
}

export function fromFileRouteParam(fileId: string): string {
  return decodeURIComponent(fileId);
}
