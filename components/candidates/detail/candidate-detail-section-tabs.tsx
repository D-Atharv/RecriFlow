import Link from "next/link";
import { FileText, LayoutGrid, List, MessageSquare, NotebookPen, Route } from "lucide-react";

const SECTION_TABS = [
  { id: "overall", label: "Overall", icon: List },
  { id: "snapshot", label: "Snapshot", icon: LayoutGrid },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "timeline", label: "Timeline", icon: Route },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "notes", label: "Notes", icon: NotebookPen },
] as const;

type CandidateDetailView = (typeof SECTION_TABS)[number]["id"];

interface CandidateDetailSectionTabsProps {
  candidateId: string;
  currentView: CandidateDetailView;
}

export function CandidateDetailSectionTabs({ candidateId, currentView }: CandidateDetailSectionTabsProps) {
  return (
    <nav
      aria-label="Candidate detail sections"
      className="sticky top-16 z-20 overflow-x-auto border-b border-slate-200 bg-slate-50/50 px-2 py-1 backdrop-blur"
    >
      <ul className="flex min-w-max items-center gap-1">
        {SECTION_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <li key={tab.id}>
              <Link
                href={`/candidates/${candidateId}?view=${tab.id}`}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200"
                  }`}
              >
                <Icon className="h-3 w-3" />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
