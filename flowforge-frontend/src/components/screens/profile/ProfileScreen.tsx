"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, updateProfile } from "@/features/profile/api";
import type { CurrentUser } from "@/features/profile/types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
}

export default function ProfileScreen() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError("");
        const data = await getCurrentUser();
        setUser(data);
        setName(data.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleSave() {
    if (!name.trim()) {
      setError("Name is required");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      const updated = await updateProfile({ name: name.trim() });
      setUser(updated);
      setName(updated.name);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      setSuccess("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="max-w-3xl">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Personal Workspace
          </p>
          <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
            Profile
          </h2>
          <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
            Manage your account details and personal information.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[24px] border border-[#e6ebf3] bg-white px-6 py-10 text-center text-[#64748b] shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          Loading profile...
        </div>
      ) : error && !user ? (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      ) : user ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h3 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
              Personal Information
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#334155]">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-[18px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#334155]">
                  Email Address
                </label>
                <input
                  value={user.email}
                  readOnly
                  className="w-full rounded-[18px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#64748b] outline-none"
                />
              </div>

              {success ? (
                <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {success}
                </div>
              ) : null}

              {error && user ? (
                <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <h3 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
              Account Summary
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Role
                </p>
                <p className="mt-2 text-[16px] font-bold text-[#0f172a]">
                  {user.role}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Status
                </p>
                <p className="mt-2 text-[16px] font-bold text-[#0f172a]">
                  {user.active ? "ACTIVE" : "INACTIVE"}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Joined
                </p>
                <p className="mt-2 text-[16px] font-bold text-[#0f172a]">
                  {formatDate(user.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
                  Workspace ID
                </p>
                <p className="mt-2 break-all text-[14px] font-bold text-[#0f172a]">
                  {user.tenantId}
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}