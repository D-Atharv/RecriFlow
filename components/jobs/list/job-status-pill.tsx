import type { JobStatus } from "@/types/domain";

const JOB_STATUS_META: Record<JobStatus, { label: string; className: string }> = {
  OPEN: {
    label: "Published",
    className: "bg-emerald-100 text-emerald-700",
  },
  ON_HOLD: {
    label: "Draft",
    className: "bg-amber-100 text-amber-700",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-gray-100 text-gray-700",
  },
};

interface JobStatusPillProps {
  status: JobStatus;
}

export function JobStatusPill({ status }: JobStatusPillProps) {
  const meta = JOB_STATUS_META[status];

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.className}`}>
      {meta.label}
    </span>
  );
}
