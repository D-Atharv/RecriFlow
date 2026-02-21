interface CandidatesOverviewMetricsProps {
  totalCandidates: number;
  activePipeline: number;
  hiredCount: number;
}

interface MetricCard {
  label: string;
  value: number;
  valueClassName?: string;
}

export function CandidatesOverviewMetrics({
  totalCandidates,
  activePipeline,
  hiredCount,
}: CandidatesOverviewMetricsProps) {
  const metrics: MetricCard[] = [
    { label: "Total Candidates", value: totalCandidates },
    { label: "Active Pipeline", value: activePipeline, valueClassName: "text-slate-800" },
    { label: "Hired", value: hiredCount, valueClassName: "text-emerald-600" },
  ];

  return (
    <div className="flex items-center gap-4">
      {metrics.map((metric) => (
        <article key={metric.label} className="border-r border-slate-100 last:border-r-0 pr-4 last:pr-0">
          <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{metric.label}</p>
          <p className={["mt-0.5 text-[15px] font-bold tracking-tight text-slate-800 leading-none", metric.valueClassName ?? ""].join(" ")}>
            {metric.value.toLocaleString("en-US")}
          </p>
        </article>
      ))}
    </div>
  );
}
