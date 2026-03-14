"use client";

import { AlertTriangle, Archive, X } from "lucide-react";

type Props = {
  open: boolean;
  projectName?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ArchiveProjectModal({
  open,
  projectName,
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  function handleClose() {
    if (loading) return;
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <div
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      <div className="absolute inset-x-0 bottom-0 top-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-8">
        <div
          className="relative ml-auto mr-auto w-full max-w-[640px] overflow-hidden rounded-t-[32px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] lg:rounded-[30px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[#e8edf5] px-7 pb-4 pt-7 lg:px-8 lg:pt-8">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#0f172a] transition hover:bg-[#f8fafc]"
              >
                <X className="h-7 w-7" />
              </button>

              <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a] lg:text-[26px]">
                Archive Project
              </h2>

              <div className="w-11" />
            </div>
          </div>

          <div className="px-7 py-7 lg:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff7ed] text-[#ea580c]">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h3 className="mt-6 text-center text-[24px] font-extrabold tracking-tight text-[#0f172a]">
              Are you sure?
            </h3>

            <p className="mx-auto mt-3 max-w-[480px] text-center text-[15px] leading-7 text-[#64748b]">
              You are about to archive{" "}
              <span className="font-extrabold text-[#0f172a]">
                {projectName || "this project"}
              </span>
              . Archived projects will be moved out of the active list.
            </p>

            <div className="mt-6 rounded-[20px] border border-[#f1d7bf] bg-[#fffaf5] px-5 py-4">
              <p className="text-[14px] font-semibold leading-6 text-[#9a5a1a]">
                You can still view archived projects later from the{" "}
                <span className="font-extrabold">Archived</span> tab.
              </p>
            </div>
          </div>

          <div className="border-t border-[#e8edf5] bg-white px-7 py-5 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="h-[56px] flex-1 rounded-[18px] border border-[#e2e8f0] bg-white text-[15px] font-extrabold text-[#475569] transition hover:bg-[#f8fafc] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex h-[56px] flex-[1.2] items-center justify-center gap-2 rounded-[18px] bg-[#ea580c] text-[15px] font-extrabold text-white shadow-[0_16px_30px_rgba(234,88,12,0.24)] transition hover:bg-[#c2410c] disabled:opacity-60"
              >
                {loading ? "Archiving..." : "Archive Project"}
                <Archive className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}