"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-[270px]">
        <Sidebar />
      </div>

      <div className="lg:pl-[270px]">
        <Topbar onLogout={handleLogout} />
        <main className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}