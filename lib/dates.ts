export function nowIso(): string {
  return new Date().toISOString();
}

export function daysSince(isoDate: string): number {
  const then = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(now - then, 0);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDate(isoDate: string | null): string {
  if (!isoDate) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}
