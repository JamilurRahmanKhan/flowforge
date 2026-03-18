"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/features/profile/api";

export default function SettingsScreen() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleChangePassword() {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError("All password fields are required");
      setSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await changePassword({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password changed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
      setSuccess("");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("flowforge_token");
    router.replace("/login");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="max-w-3xl">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#94a3b8]">
            Workspace Configuration
          </p>
          <h2 className="mt-3 text-[40px] font-extrabold tracking-tight text-[#0f172a]">
            Settings
          </h2>
          <p className="mt-4 text-[16px] leading-7 text-[#64748b]">
            Manage your security settings and session controls.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
            Change Password
          </h3>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-[18px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-[18px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#334155]">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-[18px] border border-[#dbe4ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#2563eb]"
              />
            </div>

            {success ? (
              <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-[16px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={saving}
                className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Update Password"}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#e6ebf3] bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <h3 className="text-[24px] font-extrabold tracking-tight text-[#0f172a]">
            Session
          </h3>

          <div className="mt-6 rounded-[20px] border border-[#e6ebf3] bg-[#f8fafc] p-5">
            <p className="text-[15px] font-bold text-[#0f172a]">
              Sign out from this device
            </p>
            <p className="mt-2 text-[14px] leading-6 text-[#64748b]">
              This will remove your local access token and redirect you to the login page.
            </p>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 rounded-full border border-rose-200 px-5 py-2.5 text-sm font-extrabold text-rose-600"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}