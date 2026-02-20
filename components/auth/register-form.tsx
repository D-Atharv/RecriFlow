"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { getDefaultAppRoute } from "@/lib/app-route";
import type { SessionUser } from "@/types/auth";
import { RegisterSchema, type RegisterSchemaInput } from "@/types/schemas";

type RegisterFormValues = RegisterSchemaInput;

const defaultValues: RegisterFormValues = {
  full_name: "",
  company_name: "",
  email: "",
  password: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { error?: string; user?: SessionUser };

      if (!response.ok) {
        throw new Error(payload.error ?? "Registration failed");
      }

      if (!payload.user) {
        throw new Error("Invalid registration response");
      }

      router.replace(getDefaultAppRoute(payload.user.role));
      router.refresh();
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="full_name">
          Full Name
        </label>
        <input
          {...form.register("full_name")}
          autoComplete="name"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
          id="full_name"
          placeholder="Jane Doe"
          required
          type="text"
        />
        {form.formState.errors.full_name && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.full_name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="company_name">
          Company Name
        </label>
        <div className="relative">
          <input
            {...form.register("company_name")}
            autoComplete="organization"
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
            id="company_name"
            placeholder="Acme Corp"
            required
            type="text"
          />
          <span className="material-icons-outlined absolute left-3 top-3.5 text-gray-400 text-lg">
            business
          </span>
        </div>
        {form.formState.errors.company_name && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.company_name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
          Work Email
        </label>
        <div className="relative">
          <input
            {...form.register("email")}
            autoComplete="email"
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
            id="email"
            placeholder="jane@acmecorp.com"
            required
            type="email"
          />
          <span className="material-icons-outlined absolute left-3 top-3.5 text-gray-400 text-lg">
            email
          </span>
        </div>
        {form.formState.errors.email && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            {...form.register("password")}
            autoComplete="new-password"
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none"
            id="password"
            placeholder="Create a strong password"
            required
            type="password"
          />
          <span className="material-icons-outlined absolute left-3 top-3.5 text-gray-400 text-lg">
            lock
          </span>
        </div>
        {form.formState.errors.password && (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">Must be at least 10 characters.</p>
      </div>
      <button
        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-full shadow-sm text-sm font-bold text-white bg-primary hover:bg-gray-800 dark:bg-white dark:text-primary dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors mt-2 disabled:opacity-50"
        disabled={submitting}
        type="submit"
      >
        {submitting ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
