import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
      <div className="p-8">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1f68f9] text-white shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-center text-sm text-slate-500">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}