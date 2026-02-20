"use client";

interface RootErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: RootErrorProps) {
  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <div className="space-y-4 rounded-xl border border-rose-200 bg-rose-50 p-6">
        <h1 className="text-xl font-semibold text-rose-700">Application error</h1>
        <p className="text-sm text-rose-700">{error.message || "Unexpected root-level error."}</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          Reload section
        </button>
      </div>
    </main>
  );
}

