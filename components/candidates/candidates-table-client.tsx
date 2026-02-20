"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { StatusPill } from "@/components/ui/status-pill";
import { CANDIDATE_SOURCES, PIPELINE_STAGES, type Candidate, type Job } from "@/types/domain";

interface CandidatesTableClientProps {
  candidates: Candidate[];
  jobs: Job[];
}

export function CandidatesTableClient({ candidates, jobs }: CandidatesTableClientProps) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<string>("ALL");
  const [source, setSource] = useState<string>("ALL");

  const jobMap = useMemo(() => new Map(jobs.map((job) => [job.id, job])), [jobs]);

  const rows = useMemo(() => {
    return candidates.filter((candidate) => {
      if (stage !== "ALL" && candidate.currentStage !== stage) {
        return false;
      }

      if (source !== "ALL" && candidate.source !== source) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const haystack = [candidate.fullName, candidate.email, candidate.currentRole ?? "", candidate.skills.join(" ")]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query.trim().toLowerCase());
    });
  }, [candidates, query, source, stage]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4 md:grid-cols-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--color-primary)]"
          placeholder="Search name, email, skills"
        />

        <select
          value={stage}
          onChange={(event) => setStage(event.target.value)}
          className="rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--color-primary)]"
        >
          <option value="ALL">All stages</option>
          {PIPELINE_STAGES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className="rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm outline-none focus:border-[color:var(--color-primary)]"
        >
          <option value="ALL">All sources</option>
          {CANDIDATE_SOURCES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex items-center justify-end text-sm text-[color:var(--color-ink-soft)]">
          Showing {rows.length} of {candidates.length}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[color:var(--color-border)] bg-white">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-[color:var(--color-panel)] text-xs uppercase tracking-wide text-[color:var(--color-ink-muted)]">
            <tr>
              <th className="px-4 py-3">Candidate</th>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((candidate) => (
              <tr key={candidate.id} className="border-t border-[color:var(--color-border)]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[color:var(--color-ink)]">{candidate.fullName}</p>
                  <p className="text-xs text-[color:var(--color-ink-soft)]">{candidate.email}</p>
                </td>
                <td className="px-4 py-3">{jobMap.get(candidate.jobId)?.title ?? "Unassigned"}</td>
                <td className="px-4 py-3">{candidate.totalExperienceYrs ?? "-"} yrs</td>
                <td className="px-4 py-3">{candidate.source}</td>
                <td className="px-4 py-3">
                  <StatusPill stage={candidate.currentStage} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/candidates/${candidate.id}`} className="text-[color:var(--color-primary)] hover:underline">
                    View profile
                  </Link>
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-[color:var(--color-ink-soft)]">
                  No candidates match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
