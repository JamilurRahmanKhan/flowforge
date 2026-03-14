"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ProjectToastType = "success" | "error";

export type ProjectToast = {
  id: number;
  type: ProjectToastType;
  title: string;
  description?: string;
};

type Props = {
  toasts: ProjectToast[];
  onRemove: (id: number) => void;
};

export default function ProjectToasts({ toasts, onRemove }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[140] flex w-[calc(100%-2rem)] max-w-[380px] flex-col gap-3 lg:right-6 lg:top-6">
      {toasts.map((toast) => {
        const success = toast.type === "success";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto overflow-hidden rounded-[22px] border bg-white shadow-[0_18px_45px_rgba(15,23,42,0.12)] ${
              success ? "border-emerald-200" : "border-rose-200"
            }`}
          >
            <div className="flex items-start gap-4 px-5 py-4">
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  success
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {success ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-extrabold tracking-tight text-[#0f172a]">
                  {toast.title}
                </p>

                {toast.description ? (
                  <p className="mt-1 text-[13px] leading-6 text-[#64748b]">
                    {toast.description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => onRemove(toast.id)}
                className="rounded-full p-1 text-[#94a3b8] transition hover:bg-[#f8fafc]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              className={`h-1.5 w-full ${
                success ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}