"use client";

interface AuthErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: AuthErrorProps) {
  return (
    <div className="mx-auto w-full max-w-md space-y-4 rounded-xl border border-rose-200 bg-rose-50 p-6">
      <h2 className="text-lg font-semibold text-rose-700">Authentication error</h2>
      <p className="text-sm text-rose-700">{error.message || "Unable to complete authentication flow."}</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
      >
        Retry
      </button>
    </div>
  );
}

