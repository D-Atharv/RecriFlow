"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { getDefaultAppRoute } from "@/lib/app-route";
import type { SessionUser } from "@/types/auth";
import { LoginSchema, type LoginSchemaInput } from "@/types/schemas";

const defaultValues: LoginSchemaInput = {
  email: "recruiter@talentlens.local",
  password: "Recruiter@123",
};

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginSchemaInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { error?: string; user?: SessionUser };

      if (!response.ok) {
        throw new Error(payload.error ?? "Login failed");
      }

      if (!payload.user) {
        throw new Error("Invalid login response");
      }

      router.replace(getDefaultAppRoute(payload.user.role));
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
          Email Address
        </label>
        <input
          {...form.register("email")}
          autoComplete="email"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
          id="email"
          placeholder="you@company.com"
          required
          type="email"
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
          Password
        </label>
        <input
          {...form.register("password")}
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
          id="password"
          placeholder="••••••••"
          required
          type="password"
        />
        {form.formState.errors.password && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
            id="remember-me"
            name="remember-me"
            type="checkbox"
          />
          <label className="ml-2 block text-sm text-gray-600 dark:text-gray-400 cursor-pointer" htmlFor="remember-me">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <a className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300" href="#">
            Forgot password?
          </a>
        </div>
      </div>
      <button
        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary hover:bg-gray-800 dark:bg-white dark:text-primary dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50"
        disabled={submitting}
        type="submit"
      >
        {submitting ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-xs text-[color:var(--color-ink-muted)] text-center mt-4">
        Demo users are pre-seeded. You can also register a new recruiter account.
      </p>
    </form>
  );
}
