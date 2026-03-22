"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "./AuthCard";
import { login } from "@/features/auth/api";
import { saveToken } from "@/lib/auth";
import { setActiveWorkspaceSlug } from "@/lib/workspace-session";

export default function LoginForm() {
  const router = useRouter();

  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedSlug = slug.trim().toLowerCase();

      const result = await login({
        slug: normalizedSlug,
        email: email.trim().toLowerCase(),
        password,
      });

      saveToken(result.token);
      setActiveWorkspaceSlug(normalizedSlug);

      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your FlowForge workspace"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-900">
            Workspace slug
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f68f9] focus:outline-none"
            placeholder="flowforge-inc"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-900">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f68f9] focus:outline-none"
            placeholder="jamil@example.com"
            type="email"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-900">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1f68f9] focus:outline-none"
            placeholder="••••••••"
            type="password"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-[#1f68f9] px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
}