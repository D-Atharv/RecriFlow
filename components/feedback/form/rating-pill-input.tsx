interface RatingPillInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

const SCORES = [1, 2, 3, 4, 5] as const;

export function RatingPillInput({ label, value, onChange, error }: RatingPillInputProps) {
  return (
    <div className="space-y-1.5">
      <p className="text-[12px] font-medium text-slate-700">{label}</p>
      <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
        {SCORES.map((score) => {
          const active = score === value;
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={[
                "h-7 min-w-7 rounded-lg px-2 text-[12px] font-semibold transition-colors",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-white hover:text-slate-900",
              ].join(" ")}
              aria-pressed={active}
            >
              {score}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-[11px] font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}
