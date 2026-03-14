"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Info,
  Lock,
  Users,
  X,
} from "lucide-react";
import { createProject } from "@/features/projects/api";
import type { Project } from "@/features/projects/types";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (project: Project) => void;
  onError?: (message: string) => void;
};

export default function CreateProjectModal({
  open,
  onClose,
  onCreated,
  onError,
}: Props) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [defaultWorkflow, setDefaultWorkflow] = useState(
    "Standard Agile (Kanban)"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function resetForm() {
    setName("");
    setKey("");
    setDescription("");
    setVisibility("PUBLIC");
    setDefaultWorkflow("Standard Agile (Kanban)");
    setError("");
  }

  async function handleSubmit() {
    setError("");

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    if (!key.trim()) {
      setError("Project key is required");
      return;
    }

    try {
      setLoading(true);

      const project = await createProject({
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim(),
        visibility,
        defaultWorkflow,
      });

      onCreated(project);
      resetForm();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create project";
      setError(message);
      onError?.(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      <div className="absolute inset-x-0 bottom-0 top-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-8">
        <div
          className="relative ml-auto mr-auto flex h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] lg:h-auto lg:max-h-[92vh] lg:rounded-[30px]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-[#e8edf5] bg-white">
            <div className="flex items-center justify-between px-7 pb-4 pt-7 lg:px-8 lg:pt-8">
              <button
                type="button"
                onClick={handleClose}
                className="flex h-11 w-11 items-center justify-center rounded-full text-[#0f172a] transition hover:bg-[#f8fafc]"
              >
                <X className="h-7 w-7" />
              </button>

              <h2 className="text-[24px] font-extrabold tracking-tight text-[#0f172a] lg:text-[26px]">
                Create New Project
              </h2>

              <button
                type="button"
                className="text-[16px] font-bold text-[#2563eb]"
              >
                Help
              </button>
            </div>

            <div className="flex gap-8 px-7 lg:px-8">
              <div className="border-b-[3px] border-[#2563eb] pb-4 text-[17px] font-extrabold text-[#0f172a]">
                Basics
              </div>
              <div className="border-b-[3px] border-transparent pb-4 text-[17px] font-extrabold text-[#a0aec0]">
                Access
              </div>
              <div className="border-b-[3px] border-transparent pb-4 text-[17px] font-extrabold text-[#a0aec0]">
                Settings
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-7 lg:px-8">
            <div className="space-y-8">
              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Project Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="FlowForge Dashboard"
                  className="h-[86px] w-full rounded-[18px] border border-[#dbe4ef] bg-[#f9fbfe] px-6 text-[22px] text-[#0f172a] outline-none placeholder:text-[#9aa9c2] focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Project Key
                </label>

                <div className="relative">
                  <input
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    placeholder="FF"
                    className="h-[86px] w-full rounded-[18px] border border-[#dbe4ef] bg-[#f9fbfe] px-6 pr-16 text-[22px] uppercase tracking-[0.08em] text-[#0f172a] outline-none placeholder:text-[#9aa9c2] focus:border-[#2563eb]"
                  />

                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
                    <Info className="h-7 w-7" />
                  </div>
                </div>

                <p className="mt-4 flex items-center gap-2 text-[14px] font-medium text-[#64748b]">
                  <span className="text-[16px]">⚡</span>
                  Issue key example: {key || "FF"}-123
                </p>
              </div>

              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe the goals of this project..."
                  rows={4}
                  className="w-full resize-none rounded-[18px] border border-[#dbe4ef] bg-[#f9fbfe] px-6 py-5 text-[20px] leading-9 text-[#0f172a] outline-none placeholder:text-[#9aa9c2] focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="mb-4 block text-[17px] font-extrabold text-[#0f172a]">
                  Visibility
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setVisibility("PUBLIC")}
                    className={`relative rounded-[22px] border-2 p-5 text-left transition ${
                      visibility === "PUBLIC"
                        ? "border-[#2563eb] bg-[#f3f7ff]"
                        : "border-[#e2e8f0] bg-white"
                    }`}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <Users
                        className={`h-8 w-8 ${
                          visibility === "PUBLIC"
                            ? "text-[#2563eb]"
                            : "text-[#94a3b8]"
                        }`}
                      />

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          visibility === "PUBLIC"
                            ? "border-[#2563eb]"
                            : "border-[#94a3b8]"
                        }`}
                      >
                        <div
                          className={`h-3.5 w-3.5 rounded-full ${
                            visibility === "PUBLIC"
                              ? "bg-[#2563eb]"
                              : "bg-transparent"
                          }`}
                        />
                      </div>
                    </div>

                    <p className="text-[20px] font-extrabold text-[#0f172a]">
                      Public
                    </p>
                    <p className="mt-1 text-[15px] text-[#64748b]">
                      Team access
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility("PRIVATE")}
                    className={`relative rounded-[22px] border-2 p-5 text-left transition ${
                      visibility === "PRIVATE"
                        ? "border-[#2563eb] bg-[#f3f7ff]"
                        : "border-[#e2e8f0] bg-white"
                    }`}
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <Lock
                        className={`h-8 w-8 ${
                          visibility === "PRIVATE"
                            ? "text-[#2563eb]"
                            : "text-[#94a3b8]"
                        }`}
                      />

                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          visibility === "PRIVATE"
                            ? "border-[#2563eb]"
                            : "border-[#94a3b8]"
                        }`}
                      >
                        <div
                          className={`h-3.5 w-3.5 rounded-full ${
                            visibility === "PRIVATE"
                              ? "bg-[#2563eb]"
                              : "bg-transparent"
                          }`}
                        />
                      </div>
                    </div>

                    <p className="text-[20px] font-extrabold text-[#0f172a]">
                      Private
                    </p>
                    <p className="mt-1 text-[15px] text-[#64748b]">
                      Invite only
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[17px] font-extrabold text-[#0f172a]">
                  Default Workflow
                </label>

                <div className="relative">
                  <select
                    value={defaultWorkflow}
                    onChange={(e) => setDefaultWorkflow(e.target.value)}
                    className="h-[86px] w-full appearance-none rounded-[18px] border border-[#dbe4ef] bg-[#f9fbfe] px-6 pr-16 text-[22px] text-[#0f172a] outline-none focus:border-[#2563eb]"
                  >
                    <option>Standard Agile (Kanban)</option>
                    <option>Scrum Sprint Cycle</option>
                    <option>Bug Tracking Only</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-8 w-8 -translate-y-1/2 text-[#94a3b8]" />
                </div>
              </div>

              {error ? (
                <div className="rounded-[18px] border border-rose-200 bg-rose-50 px-5 py-4 text-[14px] font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}
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
                onClick={handleSubmit}
                disabled={loading}
                className="flex h-[56px] flex-[1.35] items-center justify-center gap-2 rounded-[18px] bg-[#2563eb] text-[15px] font-extrabold text-white shadow-[0_16px_30px_rgba(37,99,235,0.24)] transition hover:bg-[#1d4ed8] disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Project"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}