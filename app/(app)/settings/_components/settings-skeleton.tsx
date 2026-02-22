export function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Subnav tabs bar */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden mb-4">
        <div className="flex gap-4 overflow-x-auto px-3.5 py-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-24 animate-pulse rounded bg-slate-100 shrink-0" />
          ))}
        </div>
      </div>

      {/* Content card */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm p-5 space-y-4">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-50" />
          ))}
        </div>
        <div className="h-32 animate-pulse rounded-lg bg-slate-50" />
      </div>
    </div>
  );
}
