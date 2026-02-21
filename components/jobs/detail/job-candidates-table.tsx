import Link from "next/link";

import { formatDate } from "@/lib/dates";
import { StatusPill } from "@/components/ui/status-pill";
import type { Candidate } from "@/types/domain";

interface JobCandidatesTableProps {
  candidates: Candidate[];
}

export function JobCandidatesTable({ candidates }: JobCandidatesTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
      <header className="border-b border-slate-100 bg-slate-50/50 px-3 py-1.5 flex items-center justify-between">
        <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">Candidate Bench</h2>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">Manage and track role bench</p>
      </header>

      {candidates.length === 0 ? (
        <div className="px-6 py-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No candidates assigned.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/20 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <th className="px-3 py-1.5">Candidate</th>
                <th className="px-3 py-1.5">Current Role</th>
                <th className="px-3 py-1.5">Stage</th>
                <th className="px-3 py-1.5">Applied</th>
                <th className="px-3 py-1.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="transition-all hover:bg-slate-50/40">
                  <td className="px-3 py-1.5">
                    <p className="text-[12px] font-bold text-slate-800 leading-tight">{candidate.fullName}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{candidate.email}</p>
                  </td>
                  <td className="px-3 py-1.5 text-[11px] font-bold text-slate-500 truncate max-w-[200px]" title={candidate.currentRole ?? ""}>
                    {candidate.currentRole ?? "Not provided"}
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="scale-90 origin-left">
                      <StatusPill stage={candidate.currentStage} />
                    </div>
                  </td>
                  <td className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">{formatDate(candidate.createdAt)}</td>
                  <td className="px-3 py-1.5 text-right">
                    <Link href={`/candidates/${candidate.id}`} className="text-[9px] font-bold text-slate-900 hover:text-slate-600 uppercase tracking-widest underline underline-offset-4 decoration-slate-200">
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
