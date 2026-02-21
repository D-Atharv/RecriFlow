import type { Recommendation } from "@/types/domain";

import { formatEnumLabel } from "@/components/candidates/detail/candidate-detail.utils";

interface FeedbackRecommendationBadgeProps {
  recommendation: Recommendation;
}

function getRecommendationTone(recommendation: Recommendation): string {
  switch (recommendation) {
    case "STRONG_YES":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "YES":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "NO":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "STRONG_NO":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-600";
  }
}

export function FeedbackRecommendationBadge({ recommendation }: FeedbackRecommendationBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest",
        getRecommendationTone(recommendation),
      ].join(" ")}
    >
      {formatEnumLabel(recommendation)}
    </span>
  );
}
