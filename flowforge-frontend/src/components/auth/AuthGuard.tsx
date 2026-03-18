"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

const PUBLIC_ROUTES = ["/login", "/register"];

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getToken();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!token && !isPublicRoute) {
      router.replace("/login");
      return;
    }

    if (token && isPublicRoute) {
      router.replace("/dashboard");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-sm font-semibold text-slate-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}