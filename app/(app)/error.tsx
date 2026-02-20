"use client";

interface AppErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="space-y-4 rounded-xl border border-rose-200 bg-rose-50 p-6">
      <h2 className="text-lg font-semibold text-rose-700">Something went wrong</h2>
      <p className="text-sm text-rose-700">{error.message || "Unexpected application error."}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}

