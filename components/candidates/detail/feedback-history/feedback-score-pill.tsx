interface FeedbackScorePillProps {
  label: string;
  value: number;
}

function getScoreTone(value: number): string {
  if (value >= 4) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (value === 3) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

export function FeedbackScorePill({ label, value }: FeedbackScorePillProps) {
  return (
    <div className="space-y-0.5">
      <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <span
        className={[
          "inline-flex w-full items-center justify-center rounded border px-1.5 py-0.5 text-[11px] font-bold",
          getScoreTone(value),
        ].join(" ")}
      >
        {value}/5
      </span>
    </div>
  );
}
