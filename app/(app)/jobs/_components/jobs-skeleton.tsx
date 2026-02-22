export function JobsSkeleton() {
  return (
    <div className="space-y-5">
      {/* Heading + actions row */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-100" />
        <div className="flex gap-2">
          <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[88px] animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-100" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-100" />
      </div>

      {/* Table rows */}
      <div className="space-y-1.5">
        <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-50" />
        ))}
      </div>
    </div>
  );
}
