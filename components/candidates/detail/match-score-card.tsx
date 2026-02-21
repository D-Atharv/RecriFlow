"use client";

interface MatchScoreCardProps {
    score: number;
}

export function MatchScoreCard({ score }: MatchScoreCardProps) {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <article className="flex w-fit items-center gap-2 rounded-lg border border-slate-100 bg-white px-2 py-1.5 shadow-sm">
            <div className="flex flex-col">
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-tight">Match Score</p>
                <p className="text-[8px] font-bold text-slate-300 uppercase leading-tight">Profile fit</p>
            </div>

            <div className="relative h-9 w-9">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 40 40">
                    <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-slate-50"
                    />
                    <circle
                        cx="20"
                        cy="20"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="text-slate-900 transition-all duration-1000 ease-out"
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-800">
                    {Math.round(score)}%
                </span>
            </div>
        </article>
    );
}
