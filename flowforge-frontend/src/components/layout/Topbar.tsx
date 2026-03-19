"use client";

import { Bell, LogOut } from "lucide-react";
import { clearToken } from "@/lib/auth";

type Props = {
  title?: string;
};

export default function Topbar({ title }: Props) {
  function handleLogout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/60 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6">
      <div>
        <h1 className="text-[28px] font-extrabold tracking-tight text-slate-950 sm:text-3xl">
          {title || "FlowForge"}
        </h1>
        <p className="hidden text-xs font-medium text-slate-500 sm:block">
          Premium workspace operations
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white shadow-sm">
          FF
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:flex"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}