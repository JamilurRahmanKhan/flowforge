"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function DashboardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title={title} onOpenMobileMenu={() => setMobileOpen(true)} />

          <main className="flex-1 px-4 py-4 pb-32 sm:px-6 sm:py-6 md:pb-6">
            {children}
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}