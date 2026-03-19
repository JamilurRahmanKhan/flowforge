"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/projects")) return "Projects";
  if (pathname.startsWith("/my-tasks")) return "My Tasks";
  if (pathname.startsWith("/members")) return "Members";
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/profile")) return "Profile";
  return "FlowForge";
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f4f7fb]">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="min-w-0 flex-1">
            <Topbar title={title} />
            <main className="px-4 pb-28 pt-4 sm:px-6 lg:px-8 lg:pb-8 lg:pt-6">
              {children}
            </main>
          </div>
        </div>

        <MobileBottomNav />
      </div>
    </AuthGuard>
  );
}