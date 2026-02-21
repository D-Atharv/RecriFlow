"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Job, JobStatus } from "@/types/domain";

interface JobActionsMenuProps {
  job: Job;
  canManage: boolean;
  onStatusChange: (job: Job, status: JobStatus) => Promise<void>;
}

const STATUS_OPTIONS: Array<{ label: string; value: JobStatus }> = [
  { label: "Set Published", value: "OPEN" },
  { label: "Move to Draft", value: "ON_HOLD" },
  { label: "Close Job", value: "CLOSED" },
];

export function JobActionsMenu({ job, canManage, onStatusChange }: JobActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [open]);

  const handleStatusChange = async (status: JobStatus): Promise<void> => {
    if (status === job.status) {
      setOpen(false);
      return;
    }

    setSubmitting(true);
    try {
      await onStatusChange(job, status);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={submitting}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={`Open actions for ${job.title}`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open ? (
        <div className="absolute right-0 top-9 z-40 w-52 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
          <Link
            href={`/jobs/${job.id}`}
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Open Job Detail
          </Link>

          {canManage ? (
            <>
              <div className="my-1 h-px bg-gray-100" />
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  disabled={submitting || option.value === job.status}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  {option.label}
                </button>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
