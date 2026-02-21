"use client";

import Link from "next/link";
import { Mail, MoreVertical, MoveRight, Archive, UserRound } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { getAdvanceStageOptions, STAGE_LABELS } from "@/lib/pipeline";
import type { Candidate, PipelineStage } from "@/types/domain";

interface CandidateActionsMenuProps {
  candidate: Candidate;
  canManage: boolean;
  disabled?: boolean;
  onAdvanceStage: (candidate: Candidate, nextStage: PipelineStage) => Promise<void>;
  onArchiveCandidate: (candidate: Candidate) => Promise<void>;
}

export function CandidateActionsMenu({
  candidate,
  canManage,
  disabled = false,
  onAdvanceStage,
  onArchiveCandidate,
}: CandidateActionsMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [showAdvanceOptions, setShowAdvanceOptions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openUp, setOpenUp] = useState(false);

  const advanceOptions = useMemo(() => getAdvanceStageOptions(candidate.currentStage), [candidate.currentStage]);
  const canAdvance = advanceOptions.length > 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    const onClickOutside = (event: MouseEvent): void => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
        setShowAdvanceOptions(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const handleAdvance = async (nextStage: PipelineStage): Promise<void> => {
    setSubmitting(true);
    try {
      await onAdvanceStage(candidate, nextStage);
      setOpen(false);
      setShowAdvanceOptions(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (): Promise<void> => {
    const confirmed = window.confirm(`Archive ${candidate.fullName}? This will move the profile to Withdrawn.`);
    if (!confirmed) {
      return;
    }

    setSubmitting(true);
    try {
      await onArchiveCandidate(candidate);
      setOpen(false);
      setShowAdvanceOptions(false);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMenu = () => {
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      // Flip if space below is less than 280px or if it's in the bottom 30% of the screen
      setOpenUp(spaceBelow < 280 || rect.bottom > windowHeight * 0.7);
    }
    setOpen((v) => !v);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        disabled={disabled || submitting}
        onClick={toggleMenu}
        className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Open actions for ${candidate.fullName}`}
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>

      {open ? (
        <div
          className={[
            "absolute right-0 z-30 w-48 rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-slate-900/5 transition-all duration-200 ease-out animate-in fade-in zoom-in-95",
            openUp ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
          ].join(" ")}
        >
          <Link
            href={`/candidates/${candidate.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <UserRound className="h-3 w-3 text-slate-400" />
            View Profile
          </Link>

          <button
            type="button"
            disabled={submitting || !canManage || !canAdvance}
            onClick={() => setShowAdvanceOptions((value) => !value)}
            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-[11px] font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              <MoveRight className="h-3 w-3 text-slate-400" />
              Advance Stage
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{canManage ? (canAdvance ? "" : "Done") : "Read only"}</span>
          </button>

          {showAdvanceOptions && canManage && canAdvance ? (
            <div className="my-1 rounded-lg border border-slate-100 bg-slate-50/50 p-1">
              {advanceOptions.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  disabled={submitting}
                  onClick={() => handleAdvance(stage)}
                  className="block w-full rounded px-2 py-1 text-left text-[10px] font-bold text-slate-600 hover:bg-white hover:border-slate-200 border border-transparent hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 transition-all uppercase tracking-tight"
                >
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          ) : null}

          <a
            href={`mailto:${candidate.email}`}
            className="flex items-center gap-2 rounded px-2 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Mail className="h-3 w-3 text-slate-400" />
            Send Email
          </a>

          <div className="my-1 h-px bg-slate-100/80" />

          <button
            type="button"
            disabled={submitting || !canManage}
            onClick={handleArchive}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] font-bold text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
          >
            <Archive className="h-3 w-3" />
            Archive Candidate
          </button>
        </div>
      ) : null}
    </div>
  );
}
