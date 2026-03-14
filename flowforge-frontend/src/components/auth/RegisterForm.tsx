"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "./AuthCard";
import { registerOrg } from "@/features/auth/api";

export default function RegisterForm() {
  const router = useRouter();

  const [organizationName, setOrganizationName] = useState("");
  const [slug, setSlug] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await registerOrg({
        organizationName: organizationName.trim(),
        slug: slug.trim(),
        ownerName: ownerName.trim(),
        ownerEmail: ownerEmail.trim(),
        password,
      });

      setSuccess(result.message || "Workspace created successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create workspace"
      subtitle="Set up your organization and owner account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-[#1f68f9] focus:outline-none"
          placeholder="Organization name"
        />

        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-[#1f68f9] focus:outline-none"
          placeholder="Workspace slug"
        />

        <input
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-[#1f68f9] focus:outline-none"
          placeholder="Owner name"
        />

        <input
          value={ownerEmail}
          onChange={(e) => setOwnerEmail(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-[#1f68f9] focus:outline-none"
          placeholder="Owner email"
          type="email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm focus:border-[#1f68f9] focus:outline-none"
          placeholder="Password"
          type="password"
        />

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-[#1f68f9] px-4 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating workspace..." : "Create workspace"}
        </button>
      </form>
    </AuthCard>
  );
}