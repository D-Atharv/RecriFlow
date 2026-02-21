import { Download, ExternalLink, FileText } from "lucide-react";

import type { Candidate } from "@/types/domain";

interface CandidateResumeViewerProps {
  candidate: Candidate;
}

function inferFileExtension(fileUrl: string): string {
  const lastSegment = fileUrl.split("/").at(-1) ?? "";
  const decoded = decodeURIComponent(lastSegment);
  const maybeExt = decoded.split(".").pop()?.toLowerCase();
  return maybeExt ?? "";
}

export function CandidateResumeViewer({ candidate }: CandidateResumeViewerProps) {
  const extension = inferFileExtension(candidate.resumeUrl);
  const isLikelyDocx = extension === "docx" || extension === "doc";

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-2.5 py-1.5 font-bold">
        <h2 className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-900 uppercase">
          <FileText className="h-3 w-3 text-slate-400" />
          Resume Viewer
        </h2>
        <div className="flex items-center gap-1">
          <a
            href={candidate.resumeUrl}
            download
            className="rounded p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900"
            aria-label="Download resume"
          >
            <Download className="h-3 w-3" />
          </a>
          <a
            href={candidate.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900"
            aria-label="Open resume in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      <div className="bg-slate-50/30 p-2">
        <div className="overflow-hidden rounded border border-slate-200 bg-white">
          <iframe
            title={`${candidate.fullName} resume`}
            src={candidate.resumeUrl}
            className="h-[580px] w-full bg-white opacity-95 transition-opacity hover:opacity-100"
            loading="lazy"
          />
        </div>
        {isLikelyDocx ? (
          <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center italic">
            DOCX preview might be browser-limited. Use download for original file.
          </p>
        ) : null}
      </div>
    </article>
  );
}
